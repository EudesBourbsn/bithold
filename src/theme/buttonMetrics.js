import { PixelRatio, Platform } from 'react-native';
import { systemFont } from './fonts';

const label = (fontSize, fontWeight) =>
  Object.freeze({ fontFamily: systemFont, fontSize, fontWeight });

const actionHeight = 48;
const action = Object.freeze({
  minHeight: actionHeight,
  height: actionHeight,
  maxHeight: actionHeight,
});

export const buttonMetrics = Object.freeze({
  primary: action,
  primaryLabel: label(16, '600'),

  link: Object.freeze({ minHeight: 36 }),
  linkLabel: label(16, '400'),

  scan: action,
  scanLabel: label(14, '400'),

  header: Object.freeze({ height: 34 }),
  headerLabel: label(15, '600'),

  walletAction: action,
  walletActionLabel: label(16, '600'),

  fee: Object.freeze({ height: 25 }),
  feeLabel: label(14, '400'),
});

export function walletActionFontSize(width, height) {
  const large = Platform.isPad || (width > height && width >= 667);
  return Math.min(
    24,
    PixelRatio.roundToNearestPixel(width / (large ? 22 : 28)),
  );
}
