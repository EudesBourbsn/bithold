import { StyleSheet } from 'react-native';
import { buttonMetrics, colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  heroGap: {
    height: 24,
  },
  amountRow: {
    height: 105,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixGap: {
    width: 5,
  },
  bitcoinMark: {
    width: 24,
    height: 24,
  },
  conversionMark: {
    width: 22,
    height: 22,
  },
  hiddenInput: {
    ...fonts.semibold,
    color: 'transparent',
    padding: 0,
  },
  conversion: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 34,
  },
  optionsGap: {
    height: 22,
  },
  options: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
    rowGap: 8,
  },
  available: {
    ...buttonMetrics.link,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 15,
    backgroundColor: colors.input,
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableLabel: {
    color: '#FFFFFFB2',
  },
  availableText: {
    ...buttonMetrics.linkLabel,
    color: colors.foreground,
  },
  feeGap: {
    height: 24,
  },
  feePill: {
    alignSelf: 'center',
    ...buttonMetrics.fee,
    paddingHorizontal: 10,
    borderRadius: 12.5,
    backgroundColor: '#FFFFFF0D',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    overflow: 'hidden',
  },
  feeLabel: {
    ...buttonMetrics.feeLabel,
    color: colors.secondary,
  },
  feeValue: {
    ...buttonMetrics.feeLabel,
    color: 'white',
  },
  buttonGap: {
    height: 25,
  },
  button: {
    paddingHorizontal: 16,
  },
  warning: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottom: {
    height: 22,
  },
});
