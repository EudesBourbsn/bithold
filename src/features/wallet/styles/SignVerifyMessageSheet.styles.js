import { StyleSheet } from 'react-native';
import { colors, sheetMetrics, typography } from '../../../theme/index';
import { inputSurface } from '../../../theme/inputTheme';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: sheetMetrics.content.horizontalInset,
    paddingVertical: 24,
    gap: 16,
  },
  description: { ...typography.secondary },
  field: { gap: 8 },
  label: { ...typography.label },
  input: {
    ...typography.input,
    ...inputSurface,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    maxHeight: 112,
    textAlignVertical: 'top',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  message: { minHeight: 96, maxHeight: 176, writingDirection: 'auto' },
  focused: { borderColor: colors.button },
  actions: { gap: 12, marginTop: 8 },
  neutral: { backgroundColor: colors.neutralButton },
  result: { ...typography.secondary, color: colors.foreground, flex: 1 },
  resultBox: {
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.backupSuccessTint,
  },
  errorBox: { backgroundColor: colors.errorBackground },
  error: { color: colors.error },
  share: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  shareText: { ...typography.label, color: colors.foreground },
});
