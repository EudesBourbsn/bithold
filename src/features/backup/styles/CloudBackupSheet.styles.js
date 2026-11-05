import { StyleSheet } from 'react-native';
import { buttonMetrics, colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  layout: {
    paddingTop: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  message: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 9,
    marginTop: 20,
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 32,
    paddingBottom: 40,
  },
  pill: {
    width: '100%',
    ...buttonMetrics.primary,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: { opacity: 0.5 },
  pillLabel: {
    ...fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.onGold,
    textAlign: 'center',
  },
  protected: {
    alignItems: 'center',
    overflow: 'hidden',
    paddingTop: 44,
    paddingBottom: 40,
  },
  protectedMessage: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  error: { alignItems: 'center' },
  errorContent: { alignItems: 'center', paddingTop: 44, marginBottom: 10 },
  errorArt: { marginBottom: 20 },
  errorBlock: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 50,
    paddingBottom: 20,
  },
  errorMessage: { lineHeight: 18.2 },
  errorFooter: {
    width: '100%',
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
  },
  liquid: {
    position: 'absolute',
    alignSelf: 'center',
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  liquidBase: {
    backgroundColor: 'rgba(38, 38, 38, 0.94)',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  liquidSuccess: {
    backgroundColor: colors.backupSuccessTint,
    borderRadius: 24,
  },
  liquidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 5,
  },
  liquidText: {
    flexShrink: 1,
    ...fonts.medium,
    fontSize: 14,
    color: '#FFFFFF',
  },
  liquidIndicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
