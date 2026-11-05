import { StyleSheet } from 'react-native';
import { buttonMetrics, colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  picker: {
    alignItems: 'center',
    paddingBottom: 40,
  },

  pickerTitle: {
    marginTop: 30,
    marginBottom: 10,
    ...fonts.semibold,
    fontSize: 25,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  pickerSubtitle: {
    paddingHorizontal: 20,
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFFB8',
    textAlign: 'center',
  },

  list: {
    alignSelf: 'stretch',
    marginTop: 50,
  },

  pickerPlate: {
    alignItems: 'center',
  },

  item: {
    marginHorizontal: 35,
    height: 68,
    marginBottom: 5,
    paddingHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemText: {
    width: '70%',
    justifyContent: 'center',
  },
  itemTitle: {
    marginBottom: 1,
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
  },
  itemDate: {
    ...fonts.regular,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.2,
    color: colors.secondary,
  },
  chevron: {
    opacity: 0.3,
  },

  active: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    paddingRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  activeGlow: {
    ...StyleSheet.absoluteFill,
    opacity: 0.5,
  },
  tagGradient: {
    ...StyleSheet.absoluteFill,
  },
  tag: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tagText: {
    ...fonts.bold,
    fontSize: 10,
    lineHeight: 22,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: colors.onGold,
  },

  past: {
    alignSelf: 'center',
    ...buttonMetrics.primary,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
  },
  pastText: {
    marginRight: 8,
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  pastPill: {
    width: 30,
    height: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  status: {
    width: '100%',
    alignItems: 'center',
  },
  plate: {
    marginTop: 40,
    alignItems: 'center',
  },
  statusText: {
    marginTop: 40,
    paddingHorizontal: 60,
    alignItems: 'center',
  },
  statusTitle: {
    ...fonts.semibold,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.25,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statusSubtitle: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 50,
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.72)',
    textAlign: 'center',
  },

  sheetText: {
    paddingHorizontal: 40,
    gap: 9,
  },
  blockSubtitle: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.72)',
    textAlign: 'center',
  },
  sheetFooter: {
    paddingHorizontal: 10,
    paddingTop: 32,
    paddingBottom: 40,
  },

  errorText: {
    paddingHorizontal: 50,
    paddingBottom: 20,
    gap: 10,
  },
  errorTitle: {
    lineHeight: undefined,
  },
  errorSubtitle: {
    lineHeight: 18.2,
  },
  errorFooter: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
  },
  pill: {
    ...buttonMetrics.primary,
    borderRadius: 25,
  },
  pillLabel: {
    lineHeight: 20,
    color: '#1E213C',
  },

  restoringSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footer: {
    width: '100%',
    paddingTop: 30,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  button: {
    ...buttonMetrics.primary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonLabel: {
    ...fonts.semibold,
    fontSize: 16,
    color: '#000000',
  },
  spinner: {
    ...buttonMetrics.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
