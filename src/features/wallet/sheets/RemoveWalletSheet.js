import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { typography } from '../../../theme/index';
import { useLock } from '../../security/providers/LockProvider';
import { styles } from '../styles/WalletSettingsSheet.styles';

export function RemoveWalletSheet({
  enabled,
  visible,
  covered = false,
  requestKey,
  wallet,
  initialStep = 'remove',
  onClose,
  onBackup,
  onBusyChange,
  onCommitted,
  onRemoved,
}) {
  const t = useT();
  const lock = useLock();
  const { removeWallet } = useWallets();
  const [step, setStep] = useState(initialStep);
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const mounted = useRef(true);
  const dismissed = useRef(false);
  const completed = useRef(false);
  const remainingWallets = useRef(null);
  const latest = useRef(null);
  latest.current = {
    enabled,
    visible,
    covered,
    requestKey,
    onClose,
    onRemoved,
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const ownerIsCurrent = () =>
    mounted.current &&
    latest.current.enabled &&
    latest.current.requestKey === requestKey;
  const finishRemoval = () => {
    if (
      !ownerIsCurrent() ||
      completed.current ||
      remainingWallets.current == null
    )
      return;
    completed.current = true;
    latest.current.onRemoved(remainingWallets.current, requestKey);
  };
  const close = (key = requestKey) => {
    if (!ownerIsCurrent() || key !== requestKey) return;
    latest.current.onClose(key);
  };
  const confirmRemoval = async () => {
    if (
      !ownerIsCurrent() ||
      !latest.current.visible ||
      latest.current.covered ||
      saving.current
    )
      return;
    if (step !== 'confirmRemove') {
      impactFeedback();
      setStep('confirmRemove');
      return;
    }
    saving.current = true;
    onBusyChange(true, requestKey);
    setBusy(true);
    try {
      await lock.requireUnlock({ reason: 'remove' });
      if (
        !ownerIsCurrent() ||
        !latest.current.visible ||
        latest.current.covered
      )
        return;
      const count = await removeWallet(wallet.id);
      onCommitted(count, requestKey);
      if (!ownerIsCurrent()) return;
      remainingWallets.current = count;
      if (dismissed.current) {
        finishRemoval();
      } else if (latest.current.visible) {
        impactFeedback();
        setStep('removed');
      }
    } catch (error) {
      if (ownerIsCurrent() && error?.code !== 'cancelled') {
        Alert.alert(
          t('remove.failed'),
          error?.message ?? t('error.operationFailed'),
        );
      }
    } finally {
      saving.current = false;
      onBusyChange(false, requestKey);
      if (mounted.current) setBusy(false);
    }
  };

  const confirmation = step === 'confirmRemove';
  const removed = step === 'removed';
  const disabled = busy || covered || !enabled || !visible;
  return (
    <AdaptiveSheet
      visible={enabled && visible}
      requestKey={requestKey}
      onClose={close}
      onDismiss={() => {
        dismissed.current = true;
        finishRemoval();
      }}
      step={step}
      bottomPadding
    >
      <View style={styles.removal}>
        <View style={styles.statusIcon}>
          <Image
            source={
              removed
                ? require('../../../../assets/illustrations/wallet-removal/success.png')
                : require('../../../../assets/illustrations/wallet-removal/warning.png')
            }
            style={removed ? styles.successImage : styles.warningImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.statusTitle}>
          {removed
            ? t('remove.removedTitle')
            : confirmation
            ? t('remove.confirmTitle')
            : t('walletSettings.remove')}
        </Text>
        <Text style={styles.statusMessage}>
          {removed
            ? remainingWallets.current
              ? t('remove.removedOthers')
              : t('remove.removedLast')
            : confirmation
            ? t('remove.confirmMessage')
            : t('remove.message', { name: wallet.name })}
        </Text>
        <View style={styles.removalActions}>
          <SheetButton
            status
            disabled={disabled}
            label={
              removed
                ? t('common.ok')
                : confirmation
                ? t('common.cancel')
                : t('walletSettings.backup')
            }
            onPress={() => {
              if (disabled) return;
              if (removed || confirmation) close();
              else onBackup();
            }}
            style={styles.whiteButton}
            textStyle={styles.whiteButtonText}
          />
          {!removed && (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={confirmRemoval}
              style={styles.secondaryRemoval}
            >
              <Text style={[typography.button, styles.secondaryRemovalText]}>
                {t('remove.confirm')}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </AdaptiveSheet>
  );
}
