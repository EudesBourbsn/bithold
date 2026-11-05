import { inputSurface, inputColors } from '../../../theme/inputTheme';
import { StyleSheet } from 'react-native';
import { buttonMetrics, colors, sheetMetrics } from '../../../theme';
import { fonts } from '../../../theme/fonts';

const medium = {
  ...fonts.medium,
  fontWeight: '500',
};
const semi = {
  ...fonts.semibold,
  fontWeight: '600',
};
export const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  heading: {
    ...medium,
    color: '#FFFFFFB3',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  hero: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },

  recipientGroup: {
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  heroIcon: {
    width: 100,
    height: 100,
  },
  heroAmount: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixContainer: {
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
  },
  plus: {
    marginTop: 12,
  },
  heroNumber: {
    ...semi,
    color: '#FFF',
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
    textAlign: 'center',
    flexShrink: 1,
  },
  heroPrefix: {
    ...semi,
    color: '#FFFFFF66',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  heroDecimal: {
    ...semi,
    color: '#FFFFFF66',
    fontSize: 20,
    lineHeight: 52.8,
    letterSpacing: -1,
  },
  muted: {
    ...medium,
    color: '#FFFFFF80',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.4,
  },
  recipient: {
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    paddingLeft: 8,
    paddingRight: 12,
    gap: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 5,
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: 50,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    ...medium,
    color: '#FFFFFFCC',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.4,
    paddingRight: 10,
  },

  valueRow: {
    flexShrink: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  value: {
    ...medium,
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.4,
    textAlign: 'right',
    flexShrink: 1,
    minWidth: 0,
  },
  pendingValue: {
    color: '#FFFFFF80',
  },

  link: {
    color: colors.button,
  },
  checkIcon: {
    marginLeft: 2,
  },

  noteValue: {
    maxWidth: 190,
  },
  notePill: {
    ...buttonMetrics.link,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  notePillText: {
    ...buttonMetrics.linkLabel,
    color: '#FFFFFF',
  },

  noteBody: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  noteTitle: {
    ...semi,
    marginTop: 36,
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 32,
    letterSpacing: -0.25,
    textAlign: 'center',
  },
  noteSection: {
    width: '100%',
    marginTop: 50,
    alignItems: 'center',
  },
  noteInputBox: {
    ...inputSurface,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  noteInput: {
    ...medium,
    flex: 1,
    height: '100%',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.4,
    paddingVertical: 0,
    paddingHorizontal: 0,
    color: inputColors.text,
  },
  noteConfirm: {
    width: 305,
    maxWidth: '100%',
    ...buttonMetrics.primary,
    borderRadius: 25,
    marginTop: 50,
  },
  feePillText: {
    ...buttonMetrics.feeLabel,
    color: colors.foreground,
  },
  feePill: {
    ...buttonMetrics.fee,
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    experimental_backgroundImage:
      'linear-gradient(to bottom, #ffffff1a, #ffffff0d)',
  },
  amountIcon: {
    width: 25,
    height: 25,
  },
  row: {
    height: 80,
    borderRadius: 16,
    paddingHorizontal: sheetMetrics.row.horizontalInset,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  pressed: {
    opacity: 0.7,
  },
  iconSlot: {
    width: 60,
    height: 50,
    paddingRight: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rowLabels: {
    flex: 1,
    marginRight: 10,
  },
  rowTitle: {
    ...medium,
    color: '#FFF',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.5,
  },
  rowDate: {
    ...medium,
    color: '#FFFFFFA3',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.5,
  },
  rowAmount: {
    ...semi,
    color: '#FFFFFFA6',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.5,
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '48%',
  },
  positive: {
    color: '#00E013',
  },
});
