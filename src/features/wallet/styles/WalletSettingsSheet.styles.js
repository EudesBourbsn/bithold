import { StyleSheet } from 'react-native';
import {
  buttonMetrics,
  colors,
  sheetMetrics,
  typography,
} from '../../../theme/index';

export const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileNameRow: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  profileName: {
    color: colors.foreground,
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
    minWidth: 120,
    maxWidth: '100%',
    padding: 0,
    includeFontPadding: false,
  },
  warning: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 16,
    backgroundColor: '#FFFFFF08',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningText: {
    color: '#FFFFFFB8',
    flex: 1,
  },
  removeArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  removeButton: {
    ...buttonMetrics.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  removeIcon: { width: 20, height: 20, opacity: 0.4 },
  removeText: {
    ...typography.button,
    color: colors.foreground,
    flexShrink: 1,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: 32,
    marginTop: 40,
  },
  removal: {
    paddingTop: 40,
  },
  statusIcon: {
    width: 213,
    height: 128,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningImage: {
    width: 117,
    height: 379 / 3,
  },
  successImage: {
    width: 109,
    height: 101,
  },
  statusTitle: {
    ...typography.sheetStatusTitle,
    textAlign: 'center',
    marginHorizontal: sheetMetrics.status.titleInset,
  },
  statusMessage: {
    ...typography.sheetDescription,
    color: '#FFFFFFB8',
    textAlign: 'center',
    marginHorizontal: sheetMetrics.status.descriptionInset,
    marginTop: sheetMetrics.status.descriptionTop,
    marginBottom: sheetMetrics.status.descriptionBottom,
  },
  removalActions: {
    paddingTop: sheetMetrics.status.actionTop,
    marginHorizontal: sheetMetrics.status.actionInset,
    marginBottom: sheetMetrics.status.actionBottom,
  },
  whiteButton: {
    backgroundColor: colors.foreground,
  },
  whiteButtonText: {
    color: colors.modal,
  },

  secondaryRemoval: {
    ...buttonMetrics.primary,
    marginTop: sheetMetrics.status.secondaryTop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryRemovalText: {
    ...buttonMetrics.linkLabel,
    color: '#FFFFFFB8',
  },

  addresses: { paddingHorizontal: 12, paddingBottom: 16 },
  addressTabs: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8 },
});
