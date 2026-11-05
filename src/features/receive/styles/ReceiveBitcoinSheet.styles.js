import { StyleSheet } from 'react-native';
import {
  buttonMetrics,
  colors,
  sheetMetrics,
  typography,
} from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  newAddress: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newAddressDimmed: { opacity: 0.4 },
  topGap: {
    height: 28,
  },
  typePill: {
    alignSelf: 'center',
    ...buttonMetrics.link,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.input,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typePillText: {
    ...buttonMetrics.linkLabel,
    color: colors.foreground,
  },
  qrGap: {
    height: 14,
  },
  qrCenter: {
    alignItems: 'center',
  },
  qr: {
    padding: sheetMetrics.receive.qrPadding,
    borderRadius: 14,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  addressGap: {
    height: 24,
  },
  addressCard: {
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 100,
    borderRadius: 24,
    backgroundColor: colors.input,
  },
  // The label: white 14 / 500 / 20.
  addressLabel: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.foreground,
  },
  addressRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  address: {
    flex: 1,
  },
  addressText: {
    ...typography.capsule,
    letterSpacing: 0,
  },
  copy: {
    width: 44,
    height: 44,
    margin: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saved: {
    position: 'absolute',
    bottom: 12,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.modal,
  },
  export: {
    position: 'absolute',
    left: -2048,
    top: 0,
    opacity: 0,
  },
});
