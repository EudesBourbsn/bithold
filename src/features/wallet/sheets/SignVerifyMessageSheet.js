import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Keyboard,
  Pressable,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { useT } from '../../../i18n/index';
import {
  impactFeedback,
  notificationFeedback,
} from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { inputProps } from '../../../theme/inputTheme';
import {
  MESSAGE_LIMIT,
  messageAddress,
  verifyBitcoinMessage,
} from '../../../wallet/domain/messageSignature';
import { useLock } from '../../security/providers/LockProvider';
import { styles } from '../styles/SignVerifyMessageSheet.styles';

export function SignVerifyMessageSheet({
  visible,
  requestKey,
  wallet,
  item,
  onClose,
}) {
  const t = useT();
  const { engine } = useWallets();
  const lock = useLock();
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [focused, setFocused] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [signed, setSigned] = useState(false);
  const operation = useRef(0);
  const working = useRef(false);
  const cancelOperation = useCallback(() => {
    operation.current++;
    working.current = false;
  }, []);
  const owner = useRef(null);
  owner.current = { visible, requestKey, walletId: wallet?.id };
  useEffect(() => {
    operation.current++;
    working.current = false;
    setBusy(false);
    setResult(null);
    setSigned(false);
    setFocused(null);
    setAddress(visible ? item?.address ?? '' : '');
    setMessage('');
    setSignature('');
    return cancelOperation;
  }, [visible, requestKey, wallet?.id, item?.address, cancelOperation]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'background') {
        operation.current++;
        working.current = false;
        setBusy(false);
      }
    });
    return () => subscription.remove();
  }, []);
  const network = wallet?.network ?? 'Mainnet';
  let available = null;
  let matches = false;
  try {
    const parsed = messageAddress(address, network);
    matches =
      !!item &&
      parsed.address === messageAddress(item.address, network).address;
    if (wallet?.watchOnly) available = 'messageSigning.watchOnly';
    else if (!matches) available = 'messageSigning.notOwned';
  } catch (error) {
    available = error.code;
  }
  const change = setter => value => {
    operation.current++;
    setResult(null);
    setSigned(false);
    setter(value);
  };
  const run = async sign => {
    if (working.current) return;
    working.current = true;
    const ticket = ++operation.current;
    const ownerKey = requestKey;
    const walletId = wallet.id;
    const current = () =>
      ticket === operation.current &&
      owner.current?.visible &&
      owner.current.requestKey === ownerKey &&
      owner.current.walletId === walletId;
    Keyboard.dismiss();
    setBusy(true);
    setResult(null);
    impactFeedback();
    try {
      if (sign) {
        await lock.requireUnlock({ reason: 'signMessage' });
        if (!current()) return;
        const value = await engine.signMessage(
          walletId,
          item,
          address,
          message,
        );
        if (!current()) return;
        setSignature(value);
        setSigned(true);
        setResult({ key: 'messageSigning.signed', success: true });
        notificationFeedback('success');
      } else {
        const valid = verifyBitcoinMessage(
          message,
          address,
          signature,
          network,
        );
        if (!current()) return;
        setResult({
          key: valid ? 'messageSigning.valid' : 'messageSigning.invalid',
          success: valid,
        });
        notificationFeedback(valid ? 'success' : 'error');
      }
    } catch (error) {
      if (current() && error?.code !== 'cancelled') {
        setResult({
          key: error?.code?.startsWith('messageSigning.')
            ? error.code
            : 'messageSigning.failed',
          success: false,
        });
        notificationFeedback('error');
      }
    } finally {
      if (ticket === operation.current) {
        working.current = false;
        setBusy(false);
      }
    }
  };
  const share = async () => {
    try {
      await Share.share({
        message: `-----BEGIN BITCOIN SIGNED MESSAGE-----\n${message}\n-----BEGIN BITCOIN SIGNATURE-----\n${address.trim()}\n${signature}\n-----END BITCOIN SIGNATURE-----`,
      });
    } catch {
      setResult({ key: 'messageSigning.shareFailed', success: false });
    }
  };
  const field = (name, value, setter, limit, extra) => (
    <View style={styles.field}>
      <Text style={styles.label}>{t(`messageSigning.${name}`)}</Text>
      <TextInput
        {...inputProps}
        accessibilityLabel={t(`messageSigning.${name}`)}
        value={value}
        onChangeText={change(setter)}
        editable={!busy}
        multiline
        maxLength={limit}
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="none"
        keyboardType={name === 'message' ? 'default' : 'ascii-capable'}
        selectionColor={colors.button}
        cursorColor={colors.button}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused(null)}
        style={[styles.input, extra, focused === name && styles.focused]}
      />
    </View>
  );
  return (
    <AdaptiveSheet
      visible={visible}
      requestKey={requestKey}
      onClose={onClose}
      header={
        <SheetHeader
          title={t('walletSettings.signVerify')}
          onBack={() => onClose(requestKey)}
        />
      }
      step="message"
    >
      <View style={styles.content}>
        <Text style={styles.description}>{t('messageSigning.help')}</Text>
        {field('address', address, setAddress, 128)}
        {field('message', message, setMessage, MESSAGE_LIMIT, styles.message)}
        {field('signature', signature, setSignature, 512)}
        {!!available && <Text style={styles.description}>{t(available)}</Text>}
        {!!result && (
          <View
            accessibilityLiveRegion="polite"
            style={[styles.resultBox, !result.success && styles.errorBox]}
          >
            <Text style={[styles.result, !result.success && styles.error]}>
              {t(result.key)}
            </Text>
          </View>
        )}
        {busy && <ActivityIndicator color={colors.button} />}
        <View style={styles.actions}>
          <SheetButton
            label={t('messageSigning.verify')}
            disabled={
              busy || !address.trim() || !message.length || !signature.trim()
            }
            onPress={() => run(false)}
            style={styles.neutral}
          />
          <SheetButton
            label={t('messageSigning.sign')}
            disabled={busy || !!available || !matches || !message.length}
            onPress={() => run(true)}
          />
        </View>
        {signed && (
          <Pressable
            accessibilityRole="button"
            style={styles.share}
            onPress={share}
          >
            <Text style={styles.shareText}>{t('receive.qrShare')}</Text>
          </Pressable>
        )}
      </View>
    </AdaptiveSheet>
  );
}
