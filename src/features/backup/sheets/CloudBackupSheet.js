import { Linking } from 'react-native';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { useT } from '../../../i18n/index';
import { WalletProtectionIcon } from '../components/WalletProtectionIcon';
import {
  BackupPrompt,
  BackupProtectedContent,
  BackupFailureContent,
} from '../components/CloudBackupContent';

export function CloudBackupSheet({
  open,
  requestKey,
  step,
  loading,
  message,
  onSecure,
  onClose,
}) {
  const t = useT();
  const done = () => onClose(requestKey);
  let content;
  switch (step) {
    case 'protect':
      content = (
        <BackupPrompt
          title={t('backup.protectTitle')}
          subtitle={t('backup.protectSubtitle')}
          label={t('backup.secure')}
          onPress={onSecure}
          disabled={loading}
          icon={<WalletProtectionIcon />}
        />
      );
      break;
    case 'protected':
      content = <BackupProtectedContent />;
      break;
    case 'access':
      content = (
        <BackupPrompt
          title={t('cloudRestore.accessTitle')}
          subtitle={message}
          label={t('common.ok')}
          onPress={done}
        />
      );
      break;
    case 'passkeys':
      content = (
        <BackupPrompt
          title={t('cloudRestore.passkeysTitle')}
          subtitle={message}
          label={t('scanner.openSettings')}
          onPress={() => {
            done();
            Linking.openSettings().catch(() => {});
          }}
        />
      );
      break;
    default:
      content = <BackupFailureContent message={message} onDone={done} />;
  }
  return (
    <AdaptiveSheet
      visible={open}
      requestKey={requestKey}
      onClose={onClose}
      step={step}
      modalBackdrop
      bottomPadding={false}
      presentation={{ horizontalInset: 5, surfaceBottomInset: 5 }}
    >
      {content}
    </AdaptiveSheet>
  );
}
