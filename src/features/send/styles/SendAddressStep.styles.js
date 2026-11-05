import { inputColors, inputSurface } from '../../../theme/inputTheme';
import { StyleSheet } from 'react-native';
import { sendFeedbackColors } from './sendFeedback';
import { fonts } from '../../../theme/fonts';

export const NOTE_LIMIT = 140;

export const styles = StyleSheet.create({
  iconGap: {
    height: 24,
  },
  icon: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    textAlign: 'center',
  },
  asset: {
    width: 80,
    height: 80,
  },
  content: {
    paddingHorizontal: 16,
  },

  field: {
    ...inputSurface,
    minHeight: 64,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldText: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  manualInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginVertical: 12,
    color: inputColors.text,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  placeholder: {
    color: inputColors.placeholder,
  },
  valid: {
    marginRight: 12,
  },
  scan: {
    width: 22,
    height: 22,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldGap: {
    height: 14,
  },
  noteInput: {
    flex: 1,
    height: 62,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  optional: {
    ...fonts.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-12deg' }],
    paddingRight: 12,
  },
  hint: {
    width: 22,
    height: 22,
    marginRight: 12,
    opacity: 0.6,
  },
  error: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: sendFeedbackColors.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    color: sendFeedbackColors.text,
    flex: 1,
  },
  buttonGap: {
    height: 16,
  },
  bottom: {
    height: 24,
  },
});
