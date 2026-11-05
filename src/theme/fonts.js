import { Platform } from 'react-native';

export const systemFont = Platform.OS === 'ios' ? 'System' : 'sans-serif';

const face = fontWeight =>
  Object.freeze({ fontFamily: systemFont, fontWeight });

export const fonts = Object.freeze({
  regular: face('400'),
  medium: face('500'),
  semibold: face('600'),
  bold: face('700'),
});
