import { ActivityIndicator, Linking, View } from 'react-native';
import { SettingsModal } from '../../settings/components/SettingsModal';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { dateLocale, useLanguage, useT } from '../../../i18n/index';
import { SlideToConfirm } from '../../send/components/SlideToConfirm';
import { CloudBackupPicker } from '../components/CloudBackupPicker';
import {
  RestoreActionButton,
  CloudRestoreStatus,
} from '../components/CloudRestoreStatus';
import { styles } from '../styles/CloudRestoreSheet.styles.js';

const restorePresentation = { horizontalInset: 5, surfaceBottomInset: 5 };

export function CloudRestoreSheet({
  open,
  requestKey,
  step,
  entries,
  picking,
  payload,
  message,
  onPick,
  onConfirm,
  onClose,
  onDismiss,
  visible,
}) {
  const t = useT();
  const locale = dateLocale(useLanguage());
  const done = (label, pill) => (
    <RestoreActionButton
      label={label}
      pill={pill}
      onPress={() => onClose(requestKey)}
    />
  );
  const content = (() => {
    switch (step) {
      case 'picker':
        return (
          <CloudBackupPicker
            key={requestKey}
            entries={entries}
            picking={picking}
            onPick={onPick}
            t={t}
            locale={locale}
          />
        );
      case 'confirm':
        return (
          <CloudRestoreStatus
            symbol="exclamationmark"
            title={t('cloud.restoreTitle')}
            subtitle={
              payload
                ? t('cloud.restorePreview', {
                    name: payload.wallet.name,
                    network: payload.options.network,
                  })
                : null
            }
            footer={<SlideToConfirm onConfirmed={onConfirm} />}
          />
        );
      case 'restoring':
        return (
          <CloudRestoreStatus
            symbol="icloud.and.arrow.down"
            title={t('cloudRestore.restoring')}
            subtitle={t('cloudRestore.restoringSubtitle')}
            subtitleStyle={styles.restoringSubtitle}
            footer={
              <View style={styles.spinner}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            }
          />
        );
      case 'done':
        return (
          <CloudRestoreStatus
            symbol="checkmark"
            title={t('cloudRestore.success')}
            subtitle={t('cloud.restoredDescription')}
            footer={done(t('common.continue'))}
          />
        );
      case 'active':
        return (
          <CloudRestoreStatus
            symbol="checkmark"
            title={t('cloudRestore.activeTitle')}
            subtitle={t('cloud.duplicate')}
            footer={done(t('common.ok'))}
          />
        );
      case 'empty':
        return (
          <CloudRestoreStatus
            symbol="exclamationmark"
            title={t('cloudRestore.emptyTitle')}
            subtitle={t('cloud.empty')}
            footer={done(t('common.ok'))}
          />
        );
      case 'access':
        return (
          <CloudRestoreStatus
            symbol="icloud.slash"
            title={t('cloudRestore.accessTitle')}
            subtitle={t('cloud.accountUnavailable')}
            layout="sheet"
            footer={done(t('common.ok'), true)}
          />
        );
      case 'passkeys':
        return (
          <CloudRestoreStatus
            symbol="lock.fill"
            title={t('cloudRestore.passkeysTitle')}
            subtitle={message}
            footer={
              <RestoreActionButton
                label={t('scanner.openSettings')}
                onPress={() => {
                  onClose(requestKey);
                  Linking.openSettings().catch(() => {});
                }}
              />
            }
          />
        );
      default:
        return (
          <CloudRestoreStatus
            symbol="exclamationmark"
            title={t('cloudRestore.errorTitle')}
            subtitle={message}
            layout="error"
            footer={done(t('common.ok'), true)}
          />
        );
    }
  })();
  return (
    <SettingsModal
      visible={visible && open}
      requestKey={requestKey}
      onClose={onClose}
      onDismiss={onDismiss}
      step={step}
      rootStep="picker"
      sizeToContent
      bottomPadding={false}
      presentation={restorePresentation}
      header={
        step === 'picker' ? (
          <SheetHeader title={t('cloudRestore.pickerHeader')} />
        ) : undefined
      }
    >
      {content}
    </SettingsModal>
  );
}
