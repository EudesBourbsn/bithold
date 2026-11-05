import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';
import { sendFeedbackColors } from './sendFeedback';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  illustration: {
    height: 120,
    alignItems: 'center',
    marginBottom: 20,
  },
  center: {
    textAlign: 'center',
  },
  descriptionGap: {
    height: 10,
  },
  sliderGap: {
    height: 25,
  },
  slider: {
    height: 50,
  },
  validation: {
    ...typography.label,
    color: sendFeedbackColors.caption,
    marginTop: 8,
  },
  detailsTop: {
    height: 28,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailLabel: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFFCC',
  },
  total: {
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginTop: 15,
    marginBottom: 24,
  },
  rbfLabel: {
    flex: 1,
  },
  unavailable: {
    minWidth: 63,
    minHeight: 25,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.subtleOutline,
    borderRadius: 12.5,
  },
  status: {
    ...fonts.medium,
    fontSize: 12,
    lineHeight: 19,
    color: '#FFFFFF80',
    textAlign: 'center',
  },
  detailsBottom: {
    height: 24,
  },
});
