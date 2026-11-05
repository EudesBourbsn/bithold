import { colors } from './colors';

const FIELD = 'rgba(23, 24, 39, 0.75)';
export const inputColors = Object.freeze({
  background: FIELD,
  border: FIELD,
  text: colors.foreground,
  focusBorder: colors.placeholder,
  placeholder: 'rgba(255, 255, 255, 0.6)',
  cursor: colors.gold,
});

export const inputProps = Object.freeze({
  placeholderTextColor: inputColors.placeholder,
  selectionColor: inputColors.cursor,
  cursorColor: inputColors.cursor,
  keyboardAppearance: 'dark',
});

export const inputSurface = Object.freeze({
  backgroundColor: inputColors.background,
  borderColor: inputColors.border,
});

export const nativeInputColors = Object.freeze({
  dividerColor: colors.divider,
  fillColor: inputColors.background,
  textColor: inputColors.text,
  placeholderColor: inputColors.placeholder,
  cursorColor: inputColors.cursor,
});
