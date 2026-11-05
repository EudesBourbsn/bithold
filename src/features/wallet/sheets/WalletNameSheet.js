import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeModules,
  Platform,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { inputProps } from '../../../theme/inputTheme';
import { colors } from '../../../theme/index';
import { WalletEmojiPicker } from '../components/WalletEmojiPicker';
import { WalletProfileAvatar } from '../components/WalletProfileAvatar';
import { getWalletEmoji } from '../data/walletProfile';
import { isValidAvatarPhoto } from '../../../wallet/domain/avatarPhoto';
import { impactFeedback } from '../../../services/feedback';
import { WalletAvatarOptions } from '../components/WalletAvatarOptions';
import { styles } from '../styles/WalletNameSheet.styles';

export function WalletNameSheet({
  visible,
  requestKey,
  wallet,
  onClose,
  onSave,
}) {
  const t = useT();
  const { height } = useWindowDimensions();
  const [name, setName] = useState(() => wallet.name ?? '');
  const [icon, setIcon] = useState(() =>
    getWalletEmoji(wallet.icon) ||
    (wallet.icon === 'profile_photo' && wallet.avatarPhoto)
      ? wallet.icon
      : 'profile_auto',
  );
  const [avatarPhoto, setAvatarPhoto] = useState(() =>
    wallet.icon === 'profile_photo' ? wallet.avatarPhoto ?? null : null,
  );
  const picking = useRef(false);
  const optionSelected = useRef(false);
  const [step, setStep] = useState('name');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [keyboardOverlap, setKeyboardOverlap] = useState(0);
  const input = useRef(null);
  const mounted = useRef(true);
  const saving = useRef(false);
  const closing = useRef(false);
  const owner = useRef({ requestKey, walletId: wallet.id });
  const latest = useRef(null);
  latest.current = {
    visible,
    requestKey,
    walletId: wallet.id,
    onClose,
    onSave,
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      input.current?.blur();
      setKeyboardOverlap(0);
      return;
    }
    const update = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow',
      event => {
        setKeyboardOverlap(Math.max(0, height - event.endCoordinates.screenY));
      },
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardOverlap(0),
    );
    return () => {
      update.remove();
      hide.remove();
    };
  }, [visible, height]);

  const ownerIsCurrent = () =>
    mounted.current &&
    !closing.current &&
    latest.current.visible &&
    latest.current.requestKey === owner.current.requestKey &&
    latest.current.walletId === owner.current.walletId;

  const close = () => {
    if (!ownerIsCurrent()) return;
    closing.current = true;
    input.current?.blur();
    Keyboard.dismiss();
    latest.current.onClose(owner.current.requestKey);
  };

  const back = () => {
    if (!ownerIsCurrent()) return;
    if (step === 'emoji' || step === 'options') {
      setStep('name');
    } else {
      close();
    }
  };

  const save = async () => {
    if (
      !ownerIsCurrent() ||
      saving.current ||
      picking.current ||
      step !== 'name'
    )
      return;
    const value = name.trim();
    if (!value || value.length > 80) {
      setError(t('error.accounts.enterWalletName180'));
      return;
    }
    saving.current = true;
    setBusy(true);
    setError('');
    try {
      await latest.current.onSave({
        name: value,
        icon,
        avatarPhoto: icon === 'profile_photo' ? avatarPhoto : null,
      });
      if (ownerIsCurrent()) close();
    } catch {
      if (ownerIsCurrent()) setError(t('error.operationFailed'));
    } finally {
      saving.current = false;
      if (
        mounted.current &&
        latest.current.requestKey === owner.current.requestKey &&
        latest.current.walletId === owner.current.walletId
      ) {
        setBusy(false);
      }
    }
  };

  const resetAvatar = () => {
    if (!ownerIsCurrent() || saving.current || picking.current) return;
    setIcon('profile_auto');
    setAvatarPhoto(null);
  };
  const openOptions = () => {
    if (!ownerIsCurrent() || saving.current || picking.current) return;
    input.current?.blur();
    Keyboard.dismiss();
    impactFeedback();
    optionSelected.current = false;
    setStep('options');
  };
  const performOption = async kind => {
    if (
      !ownerIsCurrent() ||
      saving.current ||
      picking.current ||
      optionSelected.current ||
      step !== 'options'
    )
      return;
    optionSelected.current = true;
    if (kind === 'emoji') {
      setStep('emoji');
      impactFeedback();
      return;
    }
    if (kind === 'remove') {
      resetAvatar();
      setStep('name');
      return;
    }
    if (kind !== 'library' && kind !== 'camera') return;
    picking.current = true;
    setBusy(true);
    setStep('name');
    setError('');
    try {
      const result = await NativeModules.BitholdMedia.pickWalletPhoto(kind);
      if (!ownerIsCurrent() || result == null) return;
      if (!isValidAvatarPhoto(result.base64))
        throw new Error('Invalid avatar image');
      setAvatarPhoto(result.base64);
      setIcon('profile_photo');
      impactFeedback();
    } catch (failure) {
      if (ownerIsCurrent()) {
        const key =
          failure?.code === 'camera_access_denied'
            ? 'walletName.cameraDenied'
            : failure?.code === 'camera_unavailable'
            ? 'walletName.cameraUnavailable'
            : 'walletName.photoFailed';
        setError(t(key));
      }
    } finally {
      picking.current = false;
      if (
        mounted.current &&
        latest.current.requestKey === owner.current.requestKey &&
        latest.current.walletId === owner.current.walletId
      )
        setBusy(false);
    }
  };
  const disabled = !visible || busy;
  const canSave = !!name.trim() && name.trim().length <= 80;

  return (
    <AdaptiveSheet
      visible={visible}
      requestKey={requestKey}
      onClose={close}
      header={
        <SheetHeader
          title={step === 'options' ? t('walletName.yourAvatar') : undefined}
          onBack={step === 'name' ? undefined : back}
        />
      }
      headerScrolls={step !== 'options'}
      step={step}
      tall={step !== 'options'}
      showHandle={false}
      dismissOnBackdrop={false}
      scrollProps={{
        style: step === 'options' ? undefined : styles.scroll,
        contentContainerStyle:
          step === 'options'
            ? undefined
            : [styles.scrollContent, { paddingTop: height < 736 ? 35 : 55 }],
      }}
      footer={
        step === 'name' ? (
          <View
            style={[styles.footer, { paddingBottom: 20 + keyboardOverlap }]}
          >
            <PrimaryButton
              label={t('common.continue')}
              disabled={disabled || !canSave}
              onPress={save}
            />
          </View>
        ) : undefined
      }
    >
      {step === 'options' ? (
        <WalletAvatarOptions
          canRemove={
            !!getWalletEmoji(icon) ||
            (icon === 'profile_photo' && !!avatarPhoto)
          }
          onSelect={performOption}
        />
      ) : step === 'emoji' ? (
        <WalletEmojiPicker
          icon={icon}
          color={wallet.color}
          disabled={disabled}
          onSave={selected => {
            if (!ownerIsCurrent() || saving.current) return;
            setIcon(selected);
            setAvatarPhoto(null);
            setStep('name');
          }}
        />
      ) : (
        <View style={styles.content}>
          <View style={styles.headerGroup}>
            <View style={styles.avatarSlot}>
              <WalletProfileAvatar
                icon={icon}
                name={name}
                avatarPhoto={avatarPhoto}
                color={wallet.color}
                size={120}
                disabled={disabled}
                onEdit={openOptions}
                onReset={resetAvatar}
              />
            </View>
            <View style={styles.titleGroup}>
              <Text accessibilityRole="header" style={styles.title}>
                {t('walletName.title')}
              </Text>
              <Text style={styles.subtitle}>
                {t(name ? 'walletName.reassurance' : 'walletName.introduction')}
              </Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              {...inputProps}
              selectionColor={colors.button}
              cursorColor={colors.button}
              ref={input}
              autoFocus={!picking.current}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="off"
              textContentType="none"
              spellCheck={false}
              accessibilityLabel={t('walletName.title')}
              placeholder={t('walletName.placeholder')}
              value={name}
              editable={!disabled}
              maxLength={80}
              returnKeyType="done"
              submitBehavior="submit"
              onSubmitEditing={save}
              onChangeText={value => {
                if (!ownerIsCurrent() || saving.current) return;
                setName(value);
                setError('');
              }}
              style={styles.input}
            />
            {!!error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
          </View>
        </View>
      )}
    </AdaptiveSheet>
  );
}
