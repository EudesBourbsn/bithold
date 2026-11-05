import { StyleSheet, View } from 'react-native';
import { useT } from '../../../i18n/index';
import { sheetMetrics } from '../../../theme/index';
import { SettingsModal } from '../../settings/components/SettingsModal';
import { SettingsHeader } from '../../settings/components/SettingsRow';
import { RecoveryMethod } from '../components/RecoveryMethod';

export function BackupMethodsSheet({
  visible,
  requestKey,
  onClose,
  wallet,
  protectedWithPasskey,
  onCloudBackup,
  onSecretKey,
}) {
  const t = useT();
  return (
    <SettingsModal
      visible={visible}
      requestKey={requestKey}
      onClose={onClose}
      header={<SettingsHeader title={t('backup.methodsTitle')} />}
      step="backup"
      rootStep="backup"
    >
      <View>
        <View style={styles.list}>
          <RecoveryMethod
            title={t('backup.icloudTitle')}
            icon="backup_shield"
            subtitle={t('backup.icloudSubtitle')}
            protectedWithPasskey={protectedWithPasskey}
            unprotected={!protectedWithPasskey}
            onPress={wallet.watchOnly ? undefined : onCloudBackup}
          />
          <RecoveryMethod
            title={t('restore.secretKeyTitle')}
            descriptionGap={0}
            icon="backup_key"
            subtitle={t('backup.secretKeySubtitle')}
            onPress={onSecretKey}
          />
        </View>
      </View>
    </SettingsModal>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: sheetMetrics.recovery.top,
    paddingBottom: sheetMetrics.recovery.bottom,
  },
});
