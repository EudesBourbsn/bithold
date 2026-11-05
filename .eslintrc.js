module.exports = {
  root: true,
  extends: '@react-native',
  env: { es2021: true },
  globals: { TextEncoder: 'readonly' },
  overrides: [
    {
      files: [
        'src/features/send/domain/address.js',
        'src/wallet/domain/keys/descriptors.js',
        'src/features/wallet/data/walletProfile.js',
      ],
      rules: { 'no-bitwise': 'off' },
    },
  ],
};
