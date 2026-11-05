import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/index';
import { sendCompletionMotion as metrics } from '../components/sendCompletionMotion';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: metrics.height,
    alignItems: 'center',
  },
  bar: {
    height: metrics.height,
    borderRadius: metrics.radius,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measure: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.horizontalPadding,
    gap: metrics.gap,
  },
  indicator: {
    width: metrics.indicatorSize,
    height: metrics.indicatorSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.foreground,
    flexShrink: 1,
  },
  pending: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#3A3A3C9E',
  },
  success: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#D9BC8259',
  },
});
