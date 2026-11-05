import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, View } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { setLanguage, useLanguage, useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import {
  BLOCK_EXPLORERS,
  isCustomExplorer,
} from '../../../wallet/config/blockExplorers';
import { DisablingSecurityModal } from '../../security/modals/DisablingSecurityModal';
import { useLock } from '../../security/providers/LockProvider';
import { PreferencePickerModal } from '../components/PreferencePickerModal';
import { PreferenceSwitch } from '../components/PreferenceSwitch';
import { SettingsModal } from '../components/SettingsModal';
import { ResetWalletStep } from '../components/ResetWalletStep';
import { SettingsHeader, SettingsRow } from '../components/SettingsRow';
import languages from '../data/languages.json';
import { settingsEntries } from '../data/settingsEntries';
import { useBiometricPreference } from '../hooks/useBiometricPreference';
import { useNotificationPreference } from '../hooks/useNotificationPreference';
import { useResetWalletFlow } from '../hooks/useResetWalletFlow';
import { useSoundPreference } from '../hooks/useSoundPreference';
import { styles } from '../styles/SettingsPreferences.styles.js';

export function AppSettingsSheet({
  visible,
  requestKey = 0,
  onClose,
  onReset,
  onBackup,
}) {
  const { preferences, setPreference, engine, security } = useWallets();
  const t = useT();
  const lock = useLock();
  const hasPasscode = !!security?.passcode;
  const {
    value: faceIdOn,
    busy: biometryBusy,
    titleKey: biometryTitleKey,
    change: toggleFaceId,
  } = useBiometricPreference({
    visible,
    engine,
    lock,
    hasPasscode,
    enabled: preferences.faceId,
  });
  const [passcodeBusy, setPasscodeBusy] = useState(false);
  const passcodePending = useRef(false);
  const [disabling, setDisabling] = useState(false);
  const notifications = useNotificationPreference({
    visible,
    enabled: preferences.notifications,
    engine,
  });
  const sounds = useSoundPreference({
    visible,
    enabled: preferences.sounds,
    engine,
  });
  const language = useLanguage();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [pendingCurrency, setPendingCurrency] = useState(null);

  const [picker, setPicker] = useState({
    kind: 'currency',
    open: false,
    key: 0,
  });
  const currencyRequest = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const displayedCurrency = pendingCurrency ?? preferences.currency;
  const titleFor = entry =>
    t(entry.id === 'faceId' ? biometryTitleKey : entry.titleKey);
  const togglePasscode = async () => {
    if (passcodePending.current) {
      return;
    }
    Keyboard.dismiss();
    if (hasPasscode) {
      setDisabling(true);
      return;
    }
    passcodePending.current = true;
    setPasscodeBusy(true);
    try {
      await lock.createPasscode();
    } catch (error) {
      if (mounted.current && error?.code !== 'cancelled') {
        Alert.alert(t('settings.row.passcode'), t('passcode.couldNotSet'));
      }
    } finally {
      passcodePending.current = false;
      if (mounted.current) {
        setPasscodeBusy(false);
      }
    }
  };
  // "Remove Passcode": the lock screen (passcode only), then Face ID off and
  // the passcode removed.
  const removePasscode = async () => {
    setDisabling(false);
    try {
      await lock.requireUnlock({
        reason: 'removePasscode',
        passcodeOnly: true,
      });
      await engine.setFaceId(false);
      await engine.removePasscode();
    } catch (error) {
      if (mounted.current && error?.code !== 'cancelled') {
        Alert.alert(t('settings.row.passcode'), error.message);
      }
    }
  };
  const pendingAction = useRef(null);
  useEffect(() => {
    if (visible) {
      setSearching(false);
      setQuery('');
      setPicker(previous =>
        previous.open ? { ...previous, open: false } : previous,
      );
      pendingAction.current = null;
      setDisabling(false);
    }
  }, [visible, requestKey]);
  const finish = action => {
    pendingAction.current = action;
    resetFlow.close(requestKey);
  };
  const resetFlow = useResetWalletFlow({
    visible,
    requestKey,
    requireUnlock: lock.requireUnlock,
    onConfirm: () => finish(onReset),
    onClose,
  });
  const openBackup = () => {
    impactFeedback();
    finish(onBackup);
  };
  const resetOpen = resetFlow.step !== 'settings';
  const resetStep = useRef('reset');
  if (resetOpen) {
    resetStep.current = resetFlow.step;
  }
  const resetConfirmation = resetStep.current === 'resetConfirm';
  // A new key per opening, so a tap on the row while the sheet is still
  // closing opens it again.
  const [resetKey, setResetKey] = useState(0);
  const startReset = () => {
    setResetKey(key => key + 1);
    resetFlow.start();
  };
  const openPicker = kind => {
    Keyboard.dismiss();
    impactFeedback();
    setSearching(false);
    setQuery('');
    setPicker(previous => ({ kind, open: true, key: previous.key + 1 }));
  };
  const closePicker = () =>
    setPicker(previous =>
      previous.open ? { ...previous, open: false } : previous,
    );
  const selectUnit = symbol => {
    impactFeedback();
    setPreference('unit', symbol);
    closePicker();
  };
  const toggleFixedPrecision = () => {
    impactFeedback();
    setPreference('fixedPrecision', !preferences.fixedPrecision);
  };
  const selectLanguage = locale => {
    impactFeedback();
    setLanguage(locale);
    closePicker();
  };
  const selectExplorer = value => {
    impactFeedback();
    setPreference('blockExplorer', value);
    closePicker();
  };
  const explorerLabel = isCustomExplorer(preferences.blockExplorer)
    ? t('settings.explorer.custom')
    : BLOCK_EXPLORERS.find(({ id }) => id === preferences.blockExplorer).name;
  const selectCurrency = code => {
    const request = ++currencyRequest.current;
    setPendingCurrency(code);
    Keyboard.dismiss();
    impactFeedback();
    closePicker();
    engine
      .preference('currency', code)
      .catch(error => {
        if (mounted.current && request === currencyRequest.current) {
          Alert.alert(t('settings.currencyFailed'), error.message);
        }
      })
      .finally(() => {
        if (mounted.current && request === currencyRequest.current) {
          setPendingCurrency(null);
        }
      });
  };
  const header = <SettingsHeader title={t('settings.title')} />;
  const content = (
    <>
      <View style={styles.rows}>
        {settingsEntries.map(entry => (
          <View key={entry.id} style={entry.section && styles.section}>
            <SettingsRow
              title={titleFor(entry)}
              icon={entry.icon}
              value={
                entry.id === 'currency'
                  ? displayedCurrency
                  : entry.id === 'unit'
                  ? preferences.unit
                  : entry.id === 'language'
                  ? languages.find(([locale]) => locale === language)[1]
                  : entry.id === 'blockExplorer'
                  ? explorerLabel
                  : null
              }
              disabled={
                (entry.id === 'faceId' && (!hasPasscode || biometryBusy)) ||
                (entry.id === 'notifications' && notifications.busy) ||
                (entry.id === 'sounds' && sounds.busy) ||
                (entry.id === 'passcode' && passcodeBusy)
              }
              dim={entry.id === 'faceId' && !hasPasscode}
              accessibilityHint={
                entry.id === 'faceId' && !hasPasscode
                  ? t('settings.faceIdNeedsPasscode')
                  : undefined
              }
              toggleValue={
                entry.id === 'passcode'
                  ? hasPasscode
                  : entry.id === 'faceId'
                  ? faceIdOn
                  : entry.id === 'notifications'
                  ? notifications.value
                  : entry.toggle
                  ? preferences[entry.id]
                  : undefined
              }
              label={entry.toggle ? titleFor(entry) : undefined}
              onPress={
                entry.toggle
                  ? () => {
                      impactFeedback();
                      if (entry.id === 'passcode') {
                        togglePasscode();
                      } else if (entry.id === 'faceId') {
                        toggleFaceId(!faceIdOn);
                      } else if (entry.id === 'notifications') {
                        notifications.change(!notifications.value);
                      } else if (entry.id === 'sounds') {
                        sounds.change(!preferences.sounds);
                      } else {
                        setPreference(entry.id, !preferences[entry.id]);
                      }
                    }
                  : () => {
                      if (
                        entry.id === 'currency' ||
                        entry.id === 'unit' ||
                        entry.id === 'language' ||
                        entry.id === 'blockExplorer'
                      ) {
                        openPicker(entry.id);
                      } else if (entry.id === 'reset') {
                        startReset();
                      }
                    }
              }
              trailing={
                entry.toggle ? (
                  <PreferenceSwitch
                    label={titleFor(entry)}
                    disabled={
                      (entry.id === 'faceId' &&
                        (!hasPasscode || biometryBusy)) ||
                      (entry.id === 'notifications' && notifications.busy) ||
                      (entry.id === 'sounds' && sounds.busy) ||
                      (entry.id === 'passcode' && passcodeBusy)
                    }
                    dim={entry.id === 'faceId' && !hasPasscode}
                    value={
                      entry.id === 'passcode'
                        ? hasPasscode
                        : entry.id === 'faceId'
                        ? faceIdOn
                        : entry.id === 'notifications'
                        ? notifications.value
                        : preferences[entry.id]
                    }
                    onChange={
                      entry.id === 'passcode'
                        ? () => togglePasscode()
                        : entry.id === 'faceId'
                        ? value => toggleFaceId(value)
                        : entry.id === 'notifications'
                        ? notifications.change
                        : entry.id === 'sounds'
                        ? sounds.change
                        : value => setPreference(entry.id, value)
                    }
                  />
                ) : undefined
              }
            />
          </View>
        ))}
      </View>
    </>
  );
  return (
    <>
      <SettingsModal
        visible={visible}
        requestKey={requestKey}
        onClose={resetFlow.close}
        header={header}
        step="settings"
        onDismiss={() => {
          const action = pendingAction.current;
          pendingAction.current = null;
          action?.();
        }}
      >
        {content}
      </SettingsModal>
      <AdaptiveSheet
        visible={visible && resetOpen}
        requestKey={resetKey}
        onClose={key => {
          if (key === resetKey) {
            resetFlow.dismiss();
          }
        }}
        step={resetStep.current}
        dismissOnBackdrop={!resetFlow.busy}
      >
        <ResetWalletStep
          confirmation={resetConfirmation}
          busy={resetFlow.busy}
          onBackup={openBackup}
          onCancel={resetFlow.cancel}
          onContinue={resetConfirmation ? resetFlow.confirm : resetFlow.next}
        />
      </AdaptiveSheet>
      <PreferencePickerModal
        visible={visible}
        picker={picker}
        closePicker={closePicker}
        searching={searching}
        setSearching={setSearching}
        query={query}
        setQuery={setQuery}
        displayedCurrency={displayedCurrency}
        selectCurrency={selectCurrency}
        preferences={preferences}
        selectUnit={selectUnit}
        toggleFixedPrecision={toggleFixedPrecision}
        language={language}
        selectLanguage={selectLanguage}
        selectExplorer={selectExplorer}
        t={t}
      />
      <DisablingSecurityModal
        visible={visible && disabling}
        onClose={() => setDisabling(false)}
        onRemove={removePasscode}
      />
    </>
  );
}
