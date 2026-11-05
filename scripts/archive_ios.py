#!/usr/bin/env python3
"""Archive iOS Release and record its source inputs outside the project."""

import argparse
from datetime import datetime
import json
from pathlib import Path
import subprocess
import sys
import zipfile

sys.dont_write_bytecode = True

from release_manifest import archive_report, inside, sha256, source_report, write_report


def source_zip(project, snapshot, destination):
    with zipfile.ZipFile(destination, 'x', compression=zipfile.ZIP_DEFLATED) as archive:
        for record in snapshot['files']:
            data = (project / record['path']).read_bytes()
            if sha256(data) != record['sha256']:
                raise ValueError('Source changed while preparing its snapshot')
            entry = zipfile.ZipInfo(record['path'], date_time=(1980, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = int(record['mode'], 8) << 16
            entry.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(entry, data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--output', type=Path, required=True, help='New release folder outside the source tree')
    parser.add_argument('--archive', type=Path, required=True, help='New .xcarchive path outside the source tree')
    parser.add_argument('--derived-data', type=Path, default=Path.home() / 'Library/Caches/Bithold/DerivedData')
    parser.add_argument('--allow-provisioning-updates', action='store_true')
    args = parser.parse_args()
    project = args.project.expanduser().resolve(strict=True)
    output = args.output.expanduser().resolve()
    archive = args.archive.expanduser().resolve()
    derived = args.derived_data.expanduser().resolve()
    if any(inside(path, project) or inside(project, path) for path in (output, archive, derived)):
        raise ValueError('Build products and reports must be outside the source project')
    locations = (output, archive, derived)
    for index, first in enumerate(locations):
        if any(inside(first, second) or inside(second, first) for second in locations[index + 1:]):
            raise ValueError('Release reports, archive and build cache must use separate folders')
    if output.exists() or archive.exists() or archive.suffix != '.xcarchive':
        raise ValueError('Choose a new release folder and a new .xcarchive path')
    output.mkdir(parents=True)
    before = source_report(project)
    write_report(output / 'source.json', project, before)
    source_zip(project, before, output / 'source.zip')
    command = [
        'xcodebuild', '-workspace', 'ios/Bithold.xcworkspace', '-scheme', 'Bithold',
        '-configuration', 'Release', '-sdk', 'iphoneos', '-destination', 'generic/platform=iOS',
        '-derivedDataPath', str(derived), '-archivePath', str(archive),
    ]
    if args.allow_provisioning_updates:
        command.append('-allowProvisioningUpdates')
    command.append('archive')
    print('Building iOS Release; build output is saved outside the source project.', flush=True)
    with (output / 'build.log').open('w') as log:
        subprocess.run(command, cwd=project, stdout=log, stderr=subprocess.STDOUT, check=True)
    after = source_report(project)
    if before['sourceRoot'] != after['sourceRoot']:
        raise ValueError('Source changed during the build; this archive cannot be attested')
    report = archive_report(project, archive, after)
    app = next((archive / 'Products/Applications').glob('*.app'))
    subprocess.run(['codesign', '--verify', '--deep', '--strict', str(app)], check=True)
    report['verification'] = {
        'sourceUnchangedDuringBuild': True,
        'codeSignatureVerified': True,
        'createdAt': datetime.now().astimezone().isoformat(timespec='seconds'),
        'distributionStatus': 'Not exported or submitted by this command',
    }
    write_report(output / 'archive.json', project, report)
    print(json.dumps({'build': report['artifact']['build'], 'sourceRoot': after['sourceRoot'],
                      'status': 'archive_created_not_uploaded'}, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        print(f'iOS archive: {error}', file=sys.stderr)
        sys.exit(1)
