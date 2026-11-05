import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  busy: {
    opacity: 0.4,
  },
  track: {
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.button,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  labelRow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 79,
    right: 23,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    ...fonts.semibold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    textAlign: 'center',
    color: colors.onButton,
  },
  thumb: {
    position: 'absolute',
    top: 4,
    width: 80,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  grip: {
    width: 2,
    height: 16,
    borderRadius: 27,
    backgroundColor: '#23243A3D',
  },
});
