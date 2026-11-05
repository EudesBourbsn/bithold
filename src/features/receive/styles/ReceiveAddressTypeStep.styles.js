import { StyleSheet } from 'react-native';
import { colors, sheetMetrics, typography } from '../../../theme/index';

export const styles = StyleSheet.create({
  list: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: sheetMetrics.content.horizontalInset,
  },
  row: {
    minHeight: 84,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  labels: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: typography.settingsRow,
  path: {
    ...typography.secondary,
    writingDirection: 'ltr',
    textAlign: 'left',
    fontVariant: ['tabular-nums'],
  },
  indicator: {
    width: 24,
    height: 24,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
});
