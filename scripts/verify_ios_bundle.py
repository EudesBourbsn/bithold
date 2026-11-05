#!/usr/bin/env python3
"""Rebuild and compare the JavaScript payload of a Release iOS archive."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys

sys.dont_write_bytecode = True

from release_manifest import archive_report, bundle_records, inside, source_report, write_report


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(arguments, cwd, environment, log):
    with log.open("ab") as stream:
        subprocess.run(arguments, cwd=cwd, env=environment, stdout=stream,
                       stderr=subprocess.STDOUT, check=True)


def rebuild(project, destination, node, compiler):
    destination.mkdir()
    temporary = destination / "cache"
    temporary.mkdir()
    assets = destination / "assets"
    assets.mkdir()
    environment = dict(os.environ, TMPDIR=str(temporary), TMP=str(temporary), TEMP=str(temporary))
    environment["CI"] = "1"
    javascript = destination / "main.jsbundle"
    bytecode = destination / "compiled.hbc"
    react_native = project / "node_modules/react-native"
    config_command = shlex.join([str(node), str(react_native / "cli.js"), "config"])
    run([str(node), str(react_native / "scripts/bundle.js"), "bundle",
         "--entry-file", "index.js", "--platform", "ios", "--dev", "false",
         "--reset-cache", "--bundle-output", str(javascript), "--assets-dest", str(assets),
         "--minify", "false", "--config-cmd", config_command],
        project, environment, destination / "bundle.log")
    run([str(compiler), "-emit-binary", "-max-diagnostic-width=80", "-O",
         "-out", str(bytecode), javascript.name], destination, environment,
        destination / "compiler.log")
    return {"javascriptSha256": digest(javascript), "bytecodeSha256": digest(bytecode),
            "assets": bundle_records(assets)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--archive", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True, help="A new directory outside the project/archive")
    parser.add_argument("--compiler", type=Path)
    args = parser.parse_args()
    project = args.project.expanduser().resolve(strict=True)
    archive = args.archive.expanduser().resolve(strict=True)
    output = args.output.expanduser().resolve()
    if inside(output, project) or inside(output, archive) or inside(project, output) or inside(archive, output):
        raise ValueError("Comparison output must be separate from the project and archive")
    if output.exists():
        raise ValueError("Choose a new output directory; existing results are never overwritten")
    node_value = os.environ.get("NODE_BINARY") or shutil.which("node")
    if not node_value:
        raise ValueError("Node.js is not available")
    node = Path(shutil.which(node_value) or node_value).expanduser().resolve(strict=True)
    compiler = (args.compiler or project / "node_modules/hermes-compiler/hermesc/osx-bin/hermesc").expanduser().resolve(strict=True)
    if not os.access(node, os.X_OK) or not os.access(compiler, os.X_OK):
        raise ValueError("Node.js and the Hermes compiler must be executable")
    source = source_report(project)
    archived = archive_report(project, archive, source)
    expected = archived["artifact"]["javascript"]["sha256"]
    node_hash, compiler_hash = digest(node), digest(compiler)
    package = json.loads((project / "node_modules/react-native/package.json").read_text())
    output.mkdir(parents=True)
    report = {
        "schema": "bithold.javascript-comparison.v1", "status": "incomplete",
        "sourceRoot": source["sourceRoot"], "archiveJavaScriptSha256": expected,
        "nodeSha256": node_hash, "compilerSha256": compiler_hash,
        "reactNativeVersion": package["version"],
        "scope": "Two local JavaScript/Hermes rebuilds, asset repeatability, and archived bytecode comparison only.",
        "limitations": "Does not establish native binary reproducibility, trusted build provenance, or App Store equivalence.",
    }
    try:
        first = rebuild(project, output / "run-a", node, compiler)
        second = rebuild(project, output / "run-b", node, compiler)
        report["runs"] = [first, second]
        report["sourceUnchanged"] = source_report(project)["sourceRoot"] == source["sourceRoot"]
        report["toolsUnchanged"] = digest(node) == node_hash and digest(compiler) == compiler_hash
        report["archiveUnchanged"] = archive_report(project, archive, source)["artifact"]["bundleRoot"] == archived["artifact"]["bundleRoot"]
        report["javascriptMatches"] = first["javascriptSha256"] == second["javascriptSha256"]
        report["assetsMatch"] = first["assets"] == second["assets"]
        report["bytecodeMatches"] = first["bytecodeSha256"] == second["bytecodeSha256"]
        report["archiveMatches"] = first["bytecodeSha256"] == second["bytecodeSha256"] == expected
        report["status"] = "matched" if all(report[key] for key in (
            "sourceUnchanged", "toolsUnchanged", "archiveUnchanged", "javascriptMatches", "assetsMatch", "bytecodeMatches", "archiveMatches")) else "mismatch"
    except (OSError, ValueError, subprocess.CalledProcessError):
        report["status"] = "failed"
        raise
    finally:
        write_report(output / "comparison.json", project, report)
    if report["status"] != "matched":
        raise ValueError("JavaScript comparison did not match; inspect comparison.json")
    print("JavaScript/Hermes comparison matched both rebuilds and the archive. Native binary equivalence is not established.")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        if isinstance(error, subprocess.CalledProcessError):
            message = f"Build command exited with {error.returncode}; inspect the external comparison logs"
        elif isinstance(error, OSError):
            message = "Unable to access a required build input or comparison output"
        else:
            message = str(error)
        print(f"JavaScript comparison: {message}", file=sys.stderr)
        sys.exit(1)
