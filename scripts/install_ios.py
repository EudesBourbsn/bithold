#!/usr/bin/env python3
import argparse
import datetime
import os
import pathlib
import plistlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent


def run(*args):
    subprocess.run(args, cwd=ROOT, check=True)


def main():
    parser = argparse.ArgumentParser(description="Build and install Bithold on a connected iPhone.")
    parser.add_argument('--device', default=os.environ.get('BITHOLD_IOS_DEVICE'),
                        help='Connected iPhone identifier; kept only for this invocation.')
    parser.add_argument('--team', default=os.environ.get('BITHOLD_APPLE_TEAM'),
                        help='Apple development team; defaults to the Xcode project setting.')
    parser.add_argument('--derived-data', type=pathlib.Path,
                        default=pathlib.Path.home() / 'Library/Caches/Bithold/DerivedData')
    parser.add_argument('--no-launch', action='store_true',
                        help='Build and install without opening the app on the device.')
    args = parser.parse_args()
    if not args.device:
        parser.error('Pass --device or set BITHOLD_IOS_DEVICE for the connected iPhone.')
    if not args.team:
        project = (ROOT / 'ios/Bithold.xcodeproj/project.pbxproj').read_text()
        teams = set(re.findall(r'DEVELOPMENT_TEAM = ([A-Z0-9]+);', project))
        if len(teams) != 1:
            parser.error('Pass --team or set BITHOLD_APPLE_TEAM.')
        args.team = teams.pop()
    derived_data = args.derived_data.expanduser().resolve()
    run('xcodebuild', '-workspace', 'ios/Bithold.xcworkspace', '-scheme', 'Bithold',
        '-configuration', 'Release', '-sdk', 'iphoneos',
        '-destination', f"id={args.device}",
        '-derivedDataPath', str(derived_data),
        '-allowProvisioningUpdates', '-allowProvisioningDeviceRegistration',
        f"DEVELOPMENT_TEAM={args.team}", 'CODE_SIGN_STYLE=Automatic', 'build')
    app = derived_data / 'Build/Products/Release-iphoneos/Bithold.app'
    info = plistlib.loads((app / 'Info.plist').read_bytes())
    bundle_id = info['CFBundleIdentifier']
    if not (app / 'main.jsbundle').is_file():
        parser.error('The release JavaScript bundle is missing.')
    run('codesign', '--verify', '--deep', '--strict', str(app))
    provisioning = plistlib.loads(subprocess.check_output([
        'security', 'cms', '-D', '-i', str(app / 'embedded.mobileprovision')]))
    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    if provisioning['ExpirationDate'] <= now:
        parser.error('Renew the expired provisioning profile in Xcode.')
    signed = plistlib.loads(subprocess.check_output([
        'codesign', '-d', '--entitlements', ':-', str(app)], stderr=subprocess.DEVNULL))
    app_id = f"{args.team}.{bundle_id}"
    if signed.get('application-identifier') != app_id:
        parser.error('The signed application identifier does not match the configuration.')
    if signed.get('com.apple.developer.team-identifier') != args.team:
        parser.error('The app was signed by a different development team.')
    required = plistlib.loads((ROOT / 'ios/Bithold/Bithold.entitlements').read_bytes())
    for key, value in required.items():
        actual = signed.get(key)
        matches = (isinstance(actual, list) and set(value) <= set(actual)) if isinstance(value, list) else actual == value
        if not matches:
            parser.error(f'The signed app is missing a required capability: {key}')
    run('xcrun', 'devicectl', 'device', 'install', 'app',
        '--device', args.device, str(app))
    if not args.no_launch:
        run('xcrun', 'devicectl', 'device', 'process', 'launch',
            '--terminate-existing', '--device', args.device, bundle_id)


if __name__ == '__main__':
    main()
