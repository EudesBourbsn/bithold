import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, NativeModules, Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { NativeSymbol } from '../../../components/icons/Icon';
import { SegmentedControl } from '../../../components/buttons/SegmentedControl';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors, typography } from '../../../theme/index';
import { deriveAddress, typeName } from '../../../wallet/domain/keys';
import { BackupStatusPill } from '../../backup/components/BackupStatusPill';
import { RecoveryGlass } from '../../backup/components/RecoveryGlass';
import { WarningIcon } from '../../backup/components/RecoveryMethod';
import { useCloudBackup } from '../../backup/hooks/useCloudBackup';
import { BackupMethodsSheet } from '../../backup/sheets/BackupMethodsSheet';
import { CloudBackupSheet } from '../../backup/sheets/CloudBackupSheet';
import { WalletBackupStep } from '../../backup/steps/WalletBackupStep';
import { useLock } from '../../security/providers/LockProvider';
import { SettingsModal } from '../../settings/components/SettingsModal';
import {
  SettingsHeader,
  SettingsRow,
} from '../../settings/components/SettingsRow';
import { AddressRow } from '../components/AddressRow';
import { AddressActionsSheet } from './AddressActionsSheet';
import { WalletProfileFace } from '../components/WalletProfileAvatar';
import { WalletProfileName } from '../components/WalletProfileName';
import { styles } from '../styles/WalletSettingsSheet.styles.js';
import { SignVerifyMessageSheet } from './SignVerifyMessageSheet';
import { RemoveWalletSheet } from './RemoveWalletSheet';
import { WalletNameSheet } from './WalletNameSheet';

function InformationGlyph({ signature = false }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d={
          signature
            ? 'M3 17c3-2 8-13 6-13S4 15 7 16c2 1 5-6 6-4s-1 5 1 5 4-5 5-3M3 21h18'
            : 'M8 6h13M8 12h13M8 18h13'
        }
        stroke="#FFFFFF"
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
      />
      {!signature && (
        <Path
          d="M3 6h.1M3 12h.1M3 18h.1"
          stroke="#FFFFFF"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}
export function WalletSettingsSheet({
  visible,
  requestKey = 0,
  walletId,
  initialStep = 'info',
  onClose,
  onRemoved,
}) {
  const t = useT();
  const lock = useLock();
  const cloud = useCloudBackup(visible, walletId, requestKey);
  const { wallets, engine } = useWallets();
  const wallet = wallets.find(item => item.id === walletId);
  const snapshot = useRef(wallet);
  if (wallet) {
    snapshot.current = wallet;
  }
  const current = wallet ?? snapshot.current;
  const [removal, setRemoval] = useState({
    open: false,
    key: 0,
    initialStep: 'remove',
  });
  const removalInFlight = useRef(false);
  const removalOperation = useRef(null);
  const parentDismissed = useRef(false);
  const [removalBusy, setRemovalBusy] = useState(false);
  const activeRemoval = useRef(null);
  activeRemoval.current = { visible, requestKey, walletId, key: removal.key };
  const openRemoval = () => {
    if (removalInFlight.current) return;
    impactFeedback();
    setRemoval(previous => ({
      open: true,
      key: previous.key + 1,
      initialStep: 'remove',
    }));
  };
  const closeRemoval = closedKey => {
    setRemoval(previous =>
      previous.key === closedKey ? { ...previous, open: false } : previous,
    );
  };
  const [backupSheet, setBackupSheet] = useState({ open: false, key: 0 });
  const openBackup = () => {
    impactFeedback();
    setBackupSheet(previous => ({ open: true, key: previous.key + 1 }));
  };
  const closeBackup = closedKey => {
    setBackupSheet(previous =>
      previous.key === closedKey && previous.open
        ? { ...previous, open: false }
        : previous,
    );
  };
  const [recovery, setRecovery] = useState({
    open: false,
    key: 0,
  });
  const activeRecovery = useRef(null);
  activeRecovery.current = {
    ...recovery,
    visible,
    requestKey,
    walletId,
  };
  const finishRecovery = useCallback(key => {
    setRecovery(previous =>
      key === previous.key
        ? {
            ...previous,
            open: false,
          }
        : previous,
    );
  }, []);
  const recoveryOwnerKey = recovery.key;
  const recoveryIsCurrent = useCallback(() => {
    const active = activeRecovery.current;
    return (
      active.visible &&
      active.open &&
      active.key === recoveryOwnerKey &&
      active.requestKey === requestKey &&
      active.walletId === walletId
    );
  }, [recoveryOwnerKey, requestKey, walletId]);
  const onRecoveryDone = useCallback(() => {
    if (recoveryIsCurrent()) {
      finishRecovery(recoveryOwnerKey);
    }
  }, [recoveryIsCurrent, finishRecovery, recoveryOwnerKey]);
  const openRecovery = () => {
    impactFeedback();
    setRecovery(previous => ({
      open: true,
      key: previous.key + 1,
    }));
  };
  const [removeButtonWidth, setRemoveButtonWidth] = useState(0);
  const [addressChain, setAddressChain] = useState(0);

  const [addressesSheet, setAddressesSheet] = useState({ open: false, key: 0 });
  const [addressActions, setAddressActions] = useState({
    open: false,
    key: 0,
    item: null,
  });
  const openAddressActions = item => {
    impactFeedback();
    setAddressActions(previous => ({
      open: true,
      key: previous.key + 1,
      item,
    }));
  };
  const closeAddressActions = closedKey => {
    setAddressActions(previous =>
      previous.key === closedKey ? { ...previous, open: false } : previous,
    );
  };
  const [messageSheet, setMessageSheet] = useState({
    open: false,
    key: 0,
    item: null,
  });
  const [nameSheet, setNameSheet] = useState({
    open: false,
    key: 0,
    walletId: null,
    ownerRequestKey: null,
  });
  const nameCovered =
    removalBusy ||
    cloud.sheetProps.open ||
    removal.open ||
    backupSheet.open ||
    addressesSheet.open ||
    messageSheet.open ||
    recovery.open;
  const nameOwnerMatches =
    nameSheet.walletId === walletId && nameSheet.ownerRequestKey === requestKey;
  const nameVisible =
    visible && !!wallet && nameSheet.open && nameOwnerMatches && !nameCovered;
  const activeNameSheet = useRef(null);
  activeNameSheet.current = {
    visible,
    requestKey,
    walletId,
    key: nameSheet.key,
    open: nameSheet.open && nameOwnerMatches,
    available: !!wallet,
    covered: nameCovered,
  };
  const profileNameInput = useRef(null);
  const nameEntryOwner = () => {
    const owner = activeNameSheet.current;
    if (
      !owner.visible ||
      !owner.available ||
      owner.requestKey !== requestKey ||
      owner.walletId !== walletId ||
      owner.covered ||
      owner.open ||
      removalInFlight.current
    )
      return null;
    return owner;
  };
  const openNameSheet = async () => {
    if (!nameEntryOwner()) return;
    if (!(await profileNameInput.current?.finishEditing())) return;
    const owner = nameEntryOwner();
    if (!owner) return;
    const key = owner.key + 1;
    activeNameSheet.current = { ...owner, key, open: true };
    setNameSheet({
      open: true,
      key,
      walletId,
      ownerRequestKey: requestKey,
    });
    impactFeedback();
  };
  const closeNameSheet = (closedKey = nameSheet.key) => {
    const owner = activeNameSheet.current;
    if (
      owner.requestKey !== requestKey ||
      owner.walletId !== walletId ||
      owner.key !== closedKey
    )
      return;
    activeNameSheet.current = { ...owner, open: false };
    setNameSheet(previous =>
      previous.key === closedKey ? { ...previous, open: false } : previous,
    );
  };
  const openMessage = item => {
    impactFeedback();
    setMessageSheet(previous => ({
      open: true,
      key: previous.key + 1,
      item,
    }));
  };
  const removedCount = useRef(null);
  useEffect(() => {
    setNameSheet(previous =>
      previous.open ? { ...previous, open: false } : previous,
    );
    if (visible) {
      removalInFlight.current = false;
      removalOperation.current = null;
      parentDismissed.current = false;
      setRemovalBusy(false);
      setRemoval(previous => ({
        open: initialStep === 'remove' || initialStep === 'confirmRemove',
        key: previous.key + 1,
        initialStep:
          initialStep === 'confirmRemove' ? 'confirmRemove' : 'remove',
      }));
      setBackupSheet(previous => ({
        open: initialStep === 'backup',
        key: previous.key + 1,
      }));
      setAddressChain(0);
      setAddressActions(previous => ({
        ...previous,
        open: false,
        item: null,
      }));
      setMessageSheet(previous => ({ ...previous, open: false, item: null }));
      setAddressesSheet(previous =>
        previous.open ? { ...previous, open: false } : previous,
      );
      setRecovery(previous => ({
        ...previous,
        open: false,
      }));
      removedCount.current = null;
    }
  }, [visible, requestKey, walletId, initialStep]);
  if (!current) {
    return null;
  }
  const cloudProtected =
    !!current.cloudBackup?.id && !!current.cloudBackup?.verifiedAt;
  const close = (closedRequestKey = requestKey) => {
    if (closedRequestKey !== activeRecovery.current.requestKey) {
      return;
    }
    profileNameInput.current?.finishEditing();
    finishRecovery(activeRecovery.current.key);
    onClose(closedRequestKey);
  };

  const body = (
    <View
      pointerEvents={removalBusy || nameVisible ? 'none' : 'auto'}
      accessibilityElementsHidden={removalBusy || nameVisible}
      importantForAccessibility={
        removalBusy || nameVisible ? 'no-hide-descendants' : 'auto'
      }
    >
      <View style={styles.profile}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('walletSettings.name')}
          accessibilityValue={{ text: current.name }}
          accessibilityState={{ disabled: !visible || !wallet || nameCovered }}
          disabled={!visible || !wallet || nameCovered}
          onPress={openNameSheet}
          style={styles.profileAvatar}
        >
          <View
            pointerEvents="none"
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <WalletProfileFace
              icon={current.icon}
              name={current.name}
              avatarPhoto={current.avatarPhoto}
              color={current.color}
              size={120}
            />
          </View>
        </Pressable>
        <View style={styles.profileNameRow}>
          <WalletProfileName
            key={`${current.id}:${requestKey}`}
            ref={profileNameInput}
            value={current.name}
            editable={visible && !!wallet && !nameCovered && !nameVisible}
            onSave={name => {
              const owner = activeNameSheet.current;
              if (
                !owner.available ||
                owner.walletId !== current.id ||
                owner.requestKey !== requestKey ||
                removalInFlight.current
              ) {
                throw new Error('Inactive wallet settings');
              }
              return engine.update(current.id, { name });
            }}
          />
        </View>
      </View>
      <SettingsRow
        title={t('walletSettings.backup')}
        icon="backup"
        onPress={openBackup}
      />
      <SettingsRow
        title={t('walletSettings.addresses')}
        glyph={<InformationGlyph />}
        onPress={() => {
          impactFeedback();
          setAddressChain(0);
          setAddressesSheet(previous => ({
            open: true,
            key: previous.key + 1,
          }));
        }}
      />
      <SettingsRow
        title={t('walletSettings.signVerify')}
        glyph={<InformationGlyph signature />}
        onPress={() => {
          try {
            const account =
              current.accounts.find(value => value.type === current.standard) ??
              current.accounts[0];
            const index = current.fixed
              ? 0
              : current.exposed?.[`${account.type}:0`] ?? 0;
            openMessage(
              deriveAddress(engine.wallet(current.id), account.type, 0, index),
            );
          } catch {
            openMessage(null);
          }
        }}
      />
      <View style={styles.warning}>
        <WarningIcon />
        <Text style={[typography.secondary, styles.warningText]}>
          {t('walletSettings.backupWarning')}
        </Text>
      </View>
      <View style={styles.removeArea}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('walletSettings.remove')}
          accessibilityState={{ disabled: removalBusy }}
          disabled={removalBusy}
          onPress={openRemoval}
          onLayout={event =>
            setRemoveButtonWidth(event.nativeEvent.layout.width)
          }
          style={styles.removeButton}
        >
          {removeButtonWidth > 0 && (
            <RecoveryGlass
              width={removeButtonWidth}
              height={48}
              radius={24}
              tint="rgba(255,255,255,0.08)"
              top={0.12}
              bottom={0.05}
            />
          )}
          <NativeSymbol
            accessible={false}
            symbolName="trash"
            pointSize={20}
            weight="regular"
            tintColor={colors.foreground}
            style={styles.removeIcon}
          />
          <Text style={styles.removeText}>{t('walletSettings.remove')}</Text>
        </Pressable>
      </View>
    </View>
  );
  const copyPrivateKey = async item => {
    let key = null;
    try {
      await lock.requireUnlock({ reason: 'privateKey' });
      key = await engine.addressPrivateKey(current.id, item);
      await NativeModules.BitholdMedia.copySecret(key);
      impactFeedback();
    } catch (error) {
      if (error?.code !== 'cancelled') {
        Alert.alert(
          t('addresses.copyPrivateKey'),
          error?.message ?? String(error),
        );
      }
    } finally {
      key = null;
    }
  };
  let addressesBody = null;
  if (addressesSheet.key > 0) {
    const saved = current.snapshot?.addresses ?? [];
    const chains = current.fixed ? [0] : current.chains ?? [0, 1];
    const multiple = current.accounts.length > 1;
    const rows = !chains.includes(addressChain)
      ? []
      : current.accounts
          .flatMap(account => {
            const scanned = saved.filter(
              r => r.type === account.type && r.chain === addressChain,
            );
            const used = scanned
              .filter(r => r.history?.length)
              .reduce((max, r) => Math.max(max, r.index), -1);
            const nextFree = Math.max(
              used + 1,
              current.exposed?.[`${account.type}:${addressChain}`] ?? 0,
            );
            const count = current.fixed
              ? 1
              : addressChain
              ? nextFree + 1
              : nextFree + 20;

            const source = engine.wallet(current.id) ?? current;
            return Array.from({ length: count }, (_, index) => {
              const state = scanned.find(r => r.index === index);
              return {
                key: `${account.type}:${addressChain}:${index}`,
                type: account.type,
                chain: addressChain,
                index,
                address:
                  state?.address ??
                  deriveAddress(source, account.type, addressChain, index)
                    .address,
                balance:
                  (state?.balance?.confirmed ?? 0) +
                  (state?.balance?.unconfirmed ?? 0),
                transactions: state?.history?.length ?? 0,
              };
            });
          })
          .sort((a, b) => a.index - b.index);
    addressesBody = (
      <View style={styles.addresses}>
        <View style={styles.addressTabs}>
          <SegmentedControl
            values={[t('addresses.receive'), t('addresses.change')]}
            selectedIndex={addressChain}
            onChange={setAddressChain}
          />
        </View>
        {rows.map(item => (
          <AddressRow
            key={item.key}
            item={item}
            label={multiple ? typeName(item.type) : null}
            onPress={openAddressActions}
          />
        ))}
      </View>
    );
  }
  return (
    <>
      <SettingsModal
        visible={visible}
        requestKey={requestKey}
        onClose={close}
        onDismiss={() => {
          const owner = activeRemoval.current;
          const operation = removalOperation.current;
          if (
            owner.visible &&
            operation &&
            (owner.requestKey !== operation.requestKey ||
              owner.walletId !== operation.walletId ||
              owner.key !== operation.childKey)
          )
            return;
          parentDismissed.current = true;
          if (removedCount.current != null) {
            const count = removedCount.current;
            removedCount.current = null;
            onRemoved(count);
          }
        }}
        header={<SettingsHeader title={t('walletSettings.title')} />}
        step="info"
        rootStep="info"
        keyboardShouldPersistTaps="handled"
        bottomPadding
      >
        {body}
      </SettingsModal>
      <WalletNameSheet
        key={`${current.id}:${requestKey}:${nameSheet.key}`}
        visible={nameVisible}
        requestKey={nameSheet.key}
        wallet={current}
        onClose={closeNameSheet}
        onSave={({ name, icon, avatarPhoto }) => {
          const owner = activeNameSheet.current;
          if (
            !owner.visible ||
            !owner.available ||
            !owner.open ||
            owner.covered ||
            owner.requestKey !== requestKey ||
            owner.walletId !== current.id ||
            owner.key !== nameSheet.key
          ) {
            throw new Error('Inactive wallet settings');
          }
          return engine.update(current.id, { name, icon, avatarPhoto });
        }}
      />
      <RemoveWalletSheet
        key={`${current.id}:${requestKey}:${removal.key}`}
        enabled={visible}
        visible={removal.open}
        covered={backupSheet.open || recovery.open || cloud.sheetProps.open}
        requestKey={removal.key}
        wallet={current}
        initialStep={removal.initialStep}
        onClose={closeRemoval}
        onBusyChange={(busy, childKey) => {
          const owner = activeRemoval.current;
          if (
            owner.requestKey !== requestKey ||
            owner.walletId !== current.id ||
            owner.key !== childKey
          )
            return;
          if (busy) {
            removalOperation.current = {
              requestKey,
              walletId: current.id,
              childKey,
            };
            parentDismissed.current = false;
          }
          removalInFlight.current = busy;
          setRemovalBusy(busy);
        }}
        onBackup={openBackup}
        onCommitted={(count, childKey) => {
          const operation = removalOperation.current;
          const owner = activeRemoval.current;
          if (
            owner.visible &&
            (owner.requestKey !== requestKey ||
              owner.walletId !== current.id ||
              owner.key !== childKey)
          )
            return;
          if (
            !operation ||
            operation.requestKey !== requestKey ||
            operation.walletId !== current.id ||
            operation.childKey !== childKey ||
            operation.completed
          )
            return;
          operation.completed = true;
          removedCount.current = count;
          if (parentDismissed.current) {
            removedCount.current = null;
            onRemoved(count);
          }
        }}
        onRemoved={(_count, closedKey) => {
          const owner = activeRemoval.current;
          if (
            !owner.visible ||
            owner.requestKey !== requestKey ||
            owner.walletId !== current.id ||
            owner.key !== closedKey
          )
            return;
          close(requestKey);
        }}
      />
      <BackupMethodsSheet
        visible={visible && backupSheet.open}
        requestKey={backupSheet.key}
        onClose={closeBackup}
        wallet={current}
        protectedWithPasskey={cloudProtected}
        onCloudBackup={() => {
          impactFeedback();
          cloud.open(current.id, cloudProtected);
        }}
        onSecretKey={openRecovery}
      />
      <CloudBackupSheet {...cloud.sheetProps} />
      <AdaptiveSheet
        visible={visible && recovery.open}
        requestKey={recovery.key}
        onClose={closedKey =>
          setRecovery(previous =>
            closedKey === previous.key
              ? {
                  ...previous,
                  open: false,
                }
              : previous,
          )
        }
        tall
        step="recovery"
      >
        {visible && recovery.open && (
          <WalletBackupStep
            key={`${current.id}:${recovery.key}`}
            walletId={current.id}
            onDone={onRecoveryDone}
          />
        )}
      </AdaptiveSheet>
      <BackupStatusPill {...cloud.pill} />

      <SettingsModal
        visible={visible && addressesSheet.open}
        requestKey={addressesSheet.key}
        onClose={closedKey => {
          if (closedKey !== addressesSheet.key) return;
          setAddressActions(previous => ({ ...previous, open: false }));
          setAddressesSheet(previous => ({ ...previous, open: false }));
        }}
        header={<SettingsHeader title={t('walletSettings.addresses')} />}
        step="addresses"
        rootStep="addresses"
      >
        {addressesBody}
      </SettingsModal>
      <AddressActionsSheet
        enabled={visible && addressesSheet.open}
        visible={addressActions.open}
        requestKey={addressActions.key}
        item={addressActions.item}
        onClose={closeAddressActions}
        onCopyPrivateKey={current.watchOnly ? null : copyPrivateKey}
        onSignVerify={openMessage}
      />
      <SignVerifyMessageSheet
        visible={visible && messageSheet.open}
        requestKey={messageSheet.key}
        wallet={current}
        item={messageSheet.item}
        onClose={closedKey =>
          setMessageSheet(previous =>
            previous.key === closedKey
              ? { ...previous, open: false }
              : previous,
          )
        }
      />
    </>
  );
}
