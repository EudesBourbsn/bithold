import { colors } from '../../../theme/colors';

export const welcomePalette = Object.freeze({
  // Our blue with a white label, as on the app's buttons.
  primary: '#2F7EC3',
  primaryLabel: '#FFFFFF',
  // The balance page's price card (BitcoinPriceCard): #303143 with a 1-pt
  // rgb(73, 73, 104) border, white text and a 64% white secondary line.
  secondary: '#303143',
  secondaryBorder: 'rgb(73, 73, 104)',
  text: '#FFFFFF',
  muted: 'rgba(255, 255, 255, 0.64)',
  divider: colors.divider,
  terms: 'rgba(255, 255, 255, 0.64)',
  // The balance glow's blue (BalanceGlow): its halo #3BA5DA at the flares'
  // centre, turning into its rays' #2F7EC3 halfway out.
  flareCore: [59, 165, 218],
  flareEdge: [47, 126, 195],
});

export const welcomeLayout = Object.freeze({
  compactHeight: 700,
  compactScale: 0.72,
  identityWidth: 132,
  markSize: 114.445,
  heroMinHeight: 140,
  buttonHeight: 50,
  bottomInset: 16,
  compactBottomInset: 8,
  // The balance page's 16-pt side margin.
  sideInset: 16,
  buttonRadius: 1000,
  actionGap: 20,
  buttonPaddingHorizontal: 24,
  dividerWidth: 75,
  dividerGap: 16,
  cardGap: 16,
  // The price card's radius 16 and padding 16.
  cardRadius: 16,
  cardPaddingHorizontal: 16,
  cardPaddingVertical: 16,
  cardTextGap: 2,
  cardTextInset: 8,
  chainSize: 28,
  socialSize: 50,
  socialGap: 16,
  subtitleTop: 20,
  termsTop: 44,
  termsBottomSpace: 142,
});

// The headline's size by screen height in points: under 667, 24; up to 798,
// 28; up to 896 inclusive, 30; taller, 28.
export const headlineSize = height =>
  height < 667 ? 24 : height < 798 ? 28 : height <= 896 ? 30 : 28;

export const welcomeMotion = Object.freeze({
  introHold: 800,
  delay: 900,
  stagger: 100,
  duration: 600,
  curve: [0.19, 1, 0.22, 1],
  initialScale: 0.975,
  riseFraction: 0.1,
});

export const welcomeFlares = Object.freeze({
  designWidth: 420,
  width: 676,
  height: 368,
  edgeOffset: -226,
  opacities: [
    0.58, 0.573, 0.541, 0.49, 0.412, 0.314, 0.212, 0.122, 0.055, 0.02, 0,
  ],
});
