#!/bin/bash
set -euo pipefail

project_root="${CI_PRIMARY_REPOSITORY_PATH:?Xcode Cloud repository path is required}"
tools_root="$(dirname "$project_root")/bithold-build-tools"
node_version="24.21.0"
bundler_version="2.4.22"

case "$(uname -m)" in
  arm64)
    node_arch="arm64"
    node_sha256="bed7eea5325e1108f32ce5228ddd6a5f0f08a499ee42aa7442aea583702f6057"
    ;;
  x86_64)
    node_arch="x64"
    node_sha256="1462cb3b3046b815cf8ea436d3da450ec1a9f11dac7e5a46b0ada5305d7e8097"
    ;;
  *) printf 'Unsupported build architecture\n' >&2; exit 1 ;;
esac

mkdir -p "$tools_root"
node_archive="node-v${node_version}-darwin-${node_arch}.tar.gz"
curl --fail --location --silent --show-error --retry 3 \
  "https://nodejs.org/dist/v${node_version}/${node_archive}" \
  --output "$tools_root/$node_archive"
printf '%s  %s\n' "$node_sha256" "$tools_root/$node_archive" | shasum -a 256 --check
tar -xzf "$tools_root/$node_archive" -C "$tools_root"
export NODE_BINARY="$tools_root/node-v${node_version}-darwin-${node_arch}/bin/node"
export PATH="$(dirname "$NODE_BINARY"):$PATH"

cd "$project_root"
npm ci --no-audit --no-fund

export GEM_HOME="$tools_root/gems"
export GEM_PATH="$GEM_HOME"
export PATH="$GEM_HOME/bin:$PATH"
export BUNDLE_IGNORE_CONFIG=1
export BUNDLE_APP_CONFIG="$tools_root/bundle-config"
export BUNDLE_PATH="$tools_root/bundle"
export BUNDLE_FORCE_RUBY_PLATFORM=true
export BUNDLE_FROZEN=true
export BUNDLE_JOBS=4
export BUNDLE_RETRY=3
/usr/bin/gem install bundler --version "$bundler_version" --no-document
/usr/bin/ruby "$GEM_HOME/bin/bundle" "_${bundler_version}_" install

cd "$project_root/ios"
/usr/bin/ruby "$GEM_HOME/bin/bundle" "_${bundler_version}_" exec pod install --deployment
printf 'export NODE_BINARY=%q\n' "$NODE_BINARY" > .xcode.env.local
printf 'export PATH=%q:"$PATH"\n' "$(dirname "$NODE_BINARY")" >> .xcode.env.local

cd "$project_root"
git diff --exit-code -- package-lock.json Gemfile.lock ios/Podfile.lock ios/Bithold.xcodeproj/project.pbxproj
printf 'Bithold dependencies are ready for Xcode Cloud.\n'
