#!/usr/bin/env python3
"""Fingerprint release inputs and inspect the resulting iOS archive."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import plistlib
import re
import stat
import subprocess
import sys
import tempfile

SCHEMA = "bithold.release.v1"
BUILD_INFO = "BuildInfo.json"
IGNORED_DIRS = {
    ".git", ".gradle", ".cxx", ".kotlin", ".idea", ".claude",
    "node_modules", "Pods", "xcuserdata", "DerivedData", "__pycache__",
}
GENERATED_ROOTS = {"build", "ios/build", "android/build", "android/app/build", "vendor/bundle"}
LOCAL_NAMES = {".DS_Store", ".xcode.env.local", "local.properties"}
LOCAL_SUFFIXES = (".local.json", ".xcuserstate", ".log", ".pyc")
CREDENTIAL_SUFFIXES = {".p12", ".p8", ".key", ".mobileprovision", ".provisionprofile", ".jks", ".keystore"}
LOCKFILES = ("package-lock.json", "ios/Podfile.lock", "Gemfile.lock")
DEVELOPMENT_KEYSTORE = "android/app/debug.keystore"
PRIVATE_KEY_HEADER = re.compile(rb"-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----")
LIMITATIONS = {
    "source_claim": "Content fingerprint; not a trusted build attestation.",
    "dependencies": "Lockfile hashes identify declared inputs, not all installed dependency bytes.",
    "native_reproducibility": "Not established by this manifest; executable hashes still include signing data.",
    "app_store_equivalence": "Not established; Apple processing changes distributed artifacts.",
}


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def inside(path, root):
    return path == root or root in path.parents


def file_record(path, root, source=False):
    relative = path.relative_to(root).as_posix()
    before = path.lstat()
    if path.is_symlink():
        target = os.readlink(path)
        if os.path.isabs(target) or not inside(path.resolve(strict=True), root):
            raise ValueError(f"Unsafe symlink: {relative}")
        if source:
            raise ValueError(f"Source symlinks require explicit review: {relative}")
        return {"path": relative, "type": "symlink", "target": target, "sha256": sha256(target.encode())}
    if not stat.S_ISREG(before.st_mode):
        raise ValueError(f"Unsupported file: {relative}")
    data = path.read_bytes()
    after = path.stat()
    if (before.st_size, before.st_mtime_ns, before.st_ino) != (after.st_size, after.st_mtime_ns, after.st_ino):
        raise ValueError(f"File changed while being read: {relative}")
    if source and PRIVATE_KEY_HEADER.search(data):
        raise ValueError(f"Private-key material must not be in source: {relative}")
    record = {
        "path": relative,
        "size": len(data),
        "mode": "100755" if before.st_mode & 0o111 else "100644",
        "sha256": sha256(data),
    }
    if source and relative == DEVELOPMENT_KEYSTORE:
        record["role"] = "development_only_android_signing_fixture"
    return record


def source_excluded(relative, directory):
    name = relative.name
    if directory:
        return name in IGNORED_DIRS or relative.as_posix() in GENERATED_ROOTS or name.endswith((".xcarchive", ".xcresult"))
    return name in LOCAL_NAMES or name.endswith(LOCAL_SUFFIXES) or name.startswith(".metro-health-check")


def source_files(root):
    records = []
    for current, directories, files in os.walk(root, followlinks=False):
        directories.sort()
        files.sort()
        for name in list(directories):
            path = Path(current, name)
            if source_excluded(path.relative_to(root), True):
                directories.remove(name)
            elif path.is_symlink():
                file_record(path, root, source=True)
        for name in files:
            path = Path(current, name)
            relative = path.relative_to(root)
            if source_excluded(relative, False):
                continue
            if (path.suffix.lower() in CREDENTIAL_SUFFIXES and relative.as_posix() != DEVELOPMENT_KEYSTORE
                    or name == ".env" or name.startswith(".env.") and not name.endswith((".example", ".sample"))):
                raise ValueError(f"Credential/local environment file must not be in source: {relative}")
            if path.suffix.lower() in {".ipa", ".jsbundle"}:
                raise ValueError(f"Generated release artifact must be outside source: {relative}")
            records.append(file_record(path, root, source=True))
    return sorted(records, key=lambda item: item["path"])


def command_output(arguments, cwd):
    return subprocess.run(arguments, cwd=cwd, check=True, text=True, capture_output=True, timeout=15).stdout.strip()


def git_metadata(root):
    try:
        top = Path(command_output(["git", "rev-parse", "--show-toplevel"], root)).resolve()
        if top != root:
            return None
        commit = command_output(["git", "rev-parse", "HEAD"], root)
        if not re.fullmatch(r"[0-9a-f]{40,64}", commit):
            return None
        dirty = bool(command_output(["git", "status", "--porcelain", "--untracked-files=normal"], root))
        return {"commit": commit, "dirty": dirty}
    except (OSError, subprocess.CalledProcessError):
        return None


def source_report(root):
    for required in ("package.json", *LOCKFILES):
        if not (root / required).is_file():
            raise ValueError(f"Missing release input: {required}")
    records = source_files(root)
    return {
        "schema": SCHEMA,
        "kind": "source",
        "algorithm": "sha256-canonical-json-file-records",
        "sourceRoot": sha256(canonical(records)),
        "fileCount": len(records),
        "files": records,
        "lockfiles": [item for item in records if item["path"] in LOCKFILES],
        "git": git_metadata(root),
        "limitations": LIMITATIONS,
    }


def installed_tools(root):
    node = os.environ.get("NODE_BINARY")
    compiler = os.environ.get("BITHOLD_HERMES_COMPILER")
    if not node or not compiler:
        raise ValueError("NODE_BINARY and BITHOLD_HERMES_COMPILER must identify the build tools")
    node_version = command_output([node, "--version"], root)
    runtime = json.loads((root / "node_modules/react-native/package.json").read_text())
    runtime_version = runtime.get("version", "")
    version_pattern = r"v?\d+\.\d+\.\d+(?:-[A-Za-z0-9.+-]+)?"
    if not re.fullmatch(version_pattern, node_version) or not re.fullmatch(version_pattern, runtime_version):
        raise ValueError("Unrecognized Node or React Native version")
    compiler_path = Path(compiler).expanduser().resolve(strict=True)
    if not compiler_path.is_file() or not os.access(compiler_path, os.X_OK):
        raise ValueError("Hermes compiler must be an executable file")
    return {
        "nodeVersion": node_version,
        "reactNativeVersion": runtime_version,
        "hermesCompilerSHA256": sha256(compiler_path.read_bytes()),
    }


def build_info(source, root):
    keys = {
        "configuration": "CONFIGURATION", "platform": "PLATFORM_NAME", "sdk": "SDK_NAME",
        "xcodeVersion": "XCODE_VERSION_ACTUAL", "xcodeBuild": "XCODE_PRODUCT_BUILD_VERSION",
        "bundleIdentifier": "PRODUCT_BUNDLE_IDENTIFIER", "version": "MARKETING_VERSION",
        "build": "CURRENT_PROJECT_VERSION",
    }
    metadata = {}
    for key, variable in keys.items():
        value = os.environ.get(variable, "")
        if not value or not re.fullmatch(r"[A-Za-z0-9_.+-]+", value):
            raise ValueError(f"Missing/invalid Xcode environment variable: {variable}")
        metadata[key] = value
    return {
        "schema": SCHEMA,
        "kind": "embedded-build-info",
        "sourceRoot": source["sourceRoot"],
        "fileCount": source["fileCount"],
        "lockfiles": source["lockfiles"],
        "build": metadata,
        "installedTools": installed_tools(root),
        "limitations": LIMITATIONS,
    }


def bundle_records(app):
    records = []
    for current, directories, files in os.walk(app, followlinks=False):
        directories[:] = sorted(name for name in directories if name != "_CodeSignature")
        for name in list(directories):
            path = Path(current, name)
            if path.is_symlink():
                records.append(file_record(path, app))
                directories.remove(name)
        for name in sorted(files):
            if name in {"embedded.mobileprovision", "CodeResources", ".DS_Store"}:
                continue
            records.append(file_record(Path(current, name), app))
    return sorted(records, key=lambda item: item["path"])


def archive_report(root, archive, source):
    apps = list((archive / "Products/Applications").glob("*.app"))
    if len(apps) != 1:
        raise ValueError("Expected exactly one app in the archive")
    app = apps[0].resolve(strict=True)
    if not inside(app, archive):
        raise ValueError("Archive app escapes archive directory")
    with (app / "Info.plist").open("rb") as stream:
        info = plistlib.load(stream)
    embedded = json.loads((app / BUILD_INFO).read_text())
    if embedded.get("schema") != SCHEMA or embedded.get("kind") != "embedded-build-info":
        raise ValueError("Unsupported or missing embedded build information")
    if embedded.get("build", {}).get("configuration") != "Release" or embedded.get("build", {}).get("platform") != "iphoneos":
        raise ValueError("Expected a Release build for a physical iOS device")
    if embedded.get("fileCount") != source["fileCount"] or embedded.get("lockfiles") != source["lockfiles"]:
        raise ValueError("Embedded source count or lockfiles do not match current source")
    for field, plist_key in (("sdk", "DTSDKName"), ("xcodeVersion", "DTXcode"), ("xcodeBuild", "DTXcodeBuild")):
        if embedded["build"].get(field) != str(info.get(plist_key)):
            raise ValueError(f"Embedded {field} does not match the compiled app metadata")
    if embedded.get("sourceRoot") != source["sourceRoot"]:
        raise ValueError("Current source does not match the archived build fingerprint")
    for field, plist_key in (("bundleIdentifier", "CFBundleIdentifier"), ("version", "CFBundleShortVersionString"), ("build", "CFBundleVersion")):
        if embedded["build"].get(field) != str(info.get(plist_key)):
            raise ValueError(f"Embedded {field} does not match the archive")
    records = bundle_records(app)
    by_path = {item["path"]: item for item in records}
    executable = info.get("CFBundleExecutable", "")
    if executable not in by_path or "main.jsbundle" not in by_path:
        raise ValueError("Archive is missing its executable or bundled JavaScript")
    return {
        "schema": SCHEMA,
        "kind": "archive",
        "source": source,
        "embeddedBuildInfo": embedded,
        "artifact": {
            "bundleIdentifier": info["CFBundleIdentifier"],
            "version": info["CFBundleShortVersionString"], "build": info["CFBundleVersion"],
            "bundleRoot": sha256(canonical(records)),
            "signatureFilesExcluded": True,
            "executable": by_path[executable], "javascript": by_path["main.jsbundle"], "files": records,
        },
        "limitations": LIMITATIONS,
    }


def write_report(output, project, report):
    output = output.expanduser().resolve()
    if inside(output, project):
        raise ValueError("Reports must be written outside the source project")
    output.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".release-", dir=output.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            json.dump(report, stream, ensure_ascii=False, sort_keys=True, indent=2)
            stream.write("\n")
        os.chmod(temporary, 0o644)
        os.replace(temporary, output)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1])
    subparsers = parser.add_subparsers(dest="action", required=True)
    for action in ("source", "embed", "archive"):
        sub = subparsers.add_parser(action)
        sub.add_argument("--output", type=Path, required=True)
        if action == "archive":
            sub.add_argument("--archive", type=Path, required=True)
    args = parser.parse_args()
    project = args.project.expanduser().resolve(strict=True)
    if inside(args.output.expanduser().resolve(), project):
        raise ValueError("Reports must be written outside the source project")
    source = source_report(project)
    report = source
    if args.action == "embed":
        report = build_info(source, project)
    elif args.action == "archive":
        archive = args.archive.expanduser().resolve(strict=True)
        if inside(args.output.expanduser().resolve(), archive):
            raise ValueError("The archive report must be written outside the archive")
        report = archive_report(project, archive, source)
    write_report(args.output, project, report)
    print(f"{args.action}: {source['fileCount']} source files; SHA-256 {source['sourceRoot']}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, subprocess.SubprocessError, plistlib.InvalidFileException) as error:
        print(f"release manifest: {error}", file=sys.stderr)
        sys.exit(1)
