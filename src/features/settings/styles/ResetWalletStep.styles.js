import { StyleSheet } from 'react-native';
import { statusPlateMetrics } from '../../../components/illustrations/StatusIconPlate';
import {
  buttonMetrics,
  colors,
  sheetMetrics,
  typography,
} from '../../../theme/index';

export const styles = StyleSheet.create({
  content: { paddingTop: 40 },
  title: {
    ...typography.sheetStatusTitle,
    textAlign: 'center',
    marginTop: -statusPlateMetrics.shadowOverlap,
    marginHorizontal: sheetMetrics.status.titleInset,
  },
  message: {
    ...typography.sheetDescription,
    color: '#FFFFFFB8',
    textAlign: 'center',
    marginHorizontal: sheetMetrics.status.descriptionInset,
    marginTop: sheetMetrics.status.descriptionTop,
    marginBottom: sheetMetrics.status.descriptionBottom,
  },
  actions: {
    paddingTop: sheetMetrics.status.actionTop,
    marginHorizontal: sheetMetrics.status.actionInset,
    marginBottom: sheetMetrics.status.actionBottom,
  },
  primaryButton: { backgroundColor: colors.foreground },
  primaryText: { color: colors.background },
  disabledButton: { backgroundColor: colors.neutralButton },
  disabledText: { color: colors.secondary },
  secondaryButton: {
    ...buttonMetrics.primary,
    marginTop: sheetMetrics.status.secondaryTop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { ...buttonMetrics.linkLabel, color: '#FFFFFFB8' },
});
