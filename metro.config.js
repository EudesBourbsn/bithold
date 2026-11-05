const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const sheetAnimationUtility = require.resolve(
  '@gorhom/bottom-sheet/src/utilities/animate.ts',
);
const sheetAnimationAdapter = path.join(
  __dirname,
  'src/components/sheets/motion/sheetAnimationAdapter.js',
);

const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      const resolved = context.resolveRequest(context, moduleName, platform);

      if (
        resolved.type === 'sourceFile' &&
        resolved.filePath === sheetAnimationUtility &&
        context.originModulePath !== sheetAnimationAdapter
      ) {
        return { ...resolved, filePath: sheetAnimationAdapter };
      }
      return resolved;
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
