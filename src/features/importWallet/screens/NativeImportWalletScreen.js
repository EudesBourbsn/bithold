import { useHeaderHeight } from '@react-navigation/elements';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  requireNativeComponent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWalletLoader } from '../../../app/providers/WalletLoaderProvider';
import {
  finishWalletEntry,
  useWallets,
} from '../../../app/providers/WalletProvider';
import { AppBackground } from '../../../components/backgrounds/AppBackground';
import { useT } from '../../../i18n/index';
import { selectionFeedback } from '../../../services/feedback';
import { buttonMetrics, colors, typography } from '../../../theme/index';
import { nativeInputColors } from '../../../theme/inputTheme';
import { QrScannerModal } from '../../send/modals/QrScannerModal';
import { useImportHeader } from '../components/ImportHeaderMenu';
import vocabulary from '../data/recoveryWords.json';
import {
  acceptsNativeInput,
  importNativeDraft,
  releaseAcknowledgedReplacement,
} from '../domain/nativeImportSession';
import { useNativePhraseVisibility } from '../hooks/useNativePhraseVisibility';

const NativePhraseField = requireNativeComponent('BitholdPhraseField');

export function NativeImportWalletScreen({ navigation }) {
  const t = useT();
  const { importWallet } = useWallets();
  const loader = useWalletLoader();
  const focused = useIsFocused();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const input = useRef(null);
  const scroll = useRef(null);
  const importing = useRef(false);
  const revision = useRef(0);
  const acknowledgedRevision = useRef(0);
  const textRevision = useRef(0);
  const mounted = useRef(true);
  const ownsLoader = useRef(false);
  const current = useRef(null);
  const scanGeneration = useRef(0);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [composing, setComposing] = useState(false);
  const [replacement, setReplacement] = useState(null);
  const [focusRequest, setFocusRequest] = useState(0);
  const [fieldHeight, setFieldHeight] = useState(150);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputError, setInputError] = useState('');
  current.current = { focused, scanning, hasContent, composing };
  const scanOwner = scanGeneration.current;
  const { requestPassphrase } = useImportHeader({
    navigation,
    busy,
    title: t('import.recoveryTitle'),
  });
  const visibility = useNativePhraseVisibility(
    scroll,
    focused && !scanning && !busy && keyboardVisible,
    revision,
  );
  const phraseFieldStrings = useMemo(
    () => ({
      placeholder: t('import.recoveryTitle'),
      inputLabel: t('import.inputLabel'),
      inputHint: t('import.inputHint'),
      inputAlertTitle: t('import.inputAlertTitle'),
      inputLimit: t('import.inputLimit'),
      pasteEmpty: t('import.pasteEmpty'),
      fieldInactive: t('import.fieldInactive'),
      composing: t('import.composing'),
      clear: t('import.clear'),
      scan: t('import.scan'),
      paste: t('import.paste'),
      ok: t('common.ok'),
      done: t('common.done'),
    }),
    [t],
  );
  useEffect(() => {
    mounted.current = true;
    const releaseLoader = () => {
      if (ownsLoader.current) {
        ownsLoader.current = false;
        loader.exit();
      }
    };
    const show = Keyboard.addListener('keyboardWillShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardWillHide', () =>
      setKeyboardVisible(false),
    );
    const transition = navigation.addListener('transitionEnd', event => {
      if (!event.data.closing && !importing.current) {
        setFocusRequest(value => value + 1);
      }
    });
    const blur = navigation.addListener('blur', releaseLoader);
    return () => {
      mounted.current = false;
      scanGeneration.current += 1;
      releaseLoader();
      show.remove();
      hide.remove();
      transition();
      blur();
    };
  }, [navigation, loader]);

  const isCurrent = () =>
    mounted.current &&
    navigation.isFocused() &&
    !current.current.scanning &&
    acknowledgedRevision.current >= revision.current;
  const replace = text => {
    if (text.length > 16384) {
      Alert.alert(t('import.inputAlertTitle'), t('import.inputLimit'));
      return false;
    }
    revision.current += 1;
    setInputError('');
    setReplacement({ revision: revision.current, text });
    return true;
  };
  const confirm = () => {
    if (!current.current.hasContent || current.current.composing) {
      return;
    }
    return importNativeDraft({
      lock: importing,
      isCurrent,
      isMounted: () => mounted.current,
      readSnapshot: () => {
        selectionFeedback();
        setInputError('');
        const tag = findNodeHandle(input.current);
        if (tag == null) {
          throw new Error(t('import.fieldUnavailable'));
        }
        return NativeModules.BitholdPhraseField.snapshot(tag).catch(error => {
          throw error?.code === 'field_unavailable'
            ? new Error(t('import.fieldUnavailable'))
            : error;
        });
      },
      prepare: requestPassphrase,
      commit: async (material, passphrase) => {
        ownsLoader.current = true;
        loader.enter(t('import.loading'));
        try {
          await importWallet(material, { passphrase });
        } catch (error) {
          if (ownsLoader.current) {
            ownsLoader.current = false;
            loader.exit();
          }
          throw error;
        }
      },
      onSuccess: () => {
        replace('');
        finishWalletEntry(navigation);
      },
      onError: error => {
        setInputError(error.message);
        setFocusRequest(value => value + 1);
      },
      onBusy: setBusy,
    });
  };
  const disabled =
    !hasContent || composing || busy || scanning || !!replacement;
  const footerStyle = {
    paddingBottom: Math.max(insets.bottom, 24),
  };
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <AppBackground />
      <KeyboardAvoidingView
        style={styles.contentArea}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          ref={scroll}
          {...visibility.scrollProps}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={false}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <NativePhraseField
            {...nativeInputColors}
            ref={input}
            style={[styles.phraseField, { height: fieldHeight }]}
            vocabulary={vocabulary}
            strings={phraseFieldStrings}
            replacement={replacement}
            active={focused && !scanning}
            inputEnabled={!busy}
            focusRequest={focusRequest}
            onLayout={visibility.onFieldLayout}
            onCaret={visibility.onCaret}
            onHeight={({ nativeEvent }) => setFieldHeight(nativeEvent.height)}
            onInput={({ nativeEvent }) => {
              if (!acceptsNativeInput(nativeEvent, revision.current)) {
                return;
              }
              acknowledgedRevision.current = nativeEvent.revision;
              setHasContent(nativeEvent.hasContent);
              setComposing(nativeEvent.composing);
              if (nativeEvent.textRevision !== textRevision.current) {
                textRevision.current = nativeEvent.textRevision;
                setInputError('');
              }
              setReplacement(value =>
                releaseAcknowledgedReplacement(value, nativeEvent),
              );
            }}
            onFeedback={selectionFeedback}
            onScan={() => {
              if (importing.current || !navigation.isFocused()) {
                return;
              }
              scanGeneration.current += 1;
              current.current.scanning = true;
              Keyboard.dismiss();
              setScanning(true);
            }}
          />
          {!!inputError && (
            <Text accessibilityRole="alert" style={styles.errorMessage}>
              {inputError}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.footer, footerStyle]}>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          accessibilityState={{ disabled }}
          onPress={confirm}
          style={[styles.confirm, disabled && styles.disabled]}
        >
          <Text
            style={[
              typography.button,
              { color: disabled ? colors.secondary : colors.onButton },
            ]}
          >
            {t('common.continue')}
          </Text>
        </Pressable>
      </View>
      <QrScannerModal
        visible={scanning}
        raw
        onClose={() => {
          if (scanOwner !== scanGeneration.current) {
            return;
          }
          scanGeneration.current += 1;
          current.current.scanning = false;
          setScanning(false);
        }}
        onScanned={value => {
          if (
            !mounted.current ||
            importing.current ||
            !navigation.isFocused() ||
            !current.current.scanning ||
            scanOwner !== scanGeneration.current
          ) {
            return;
          }
          if (replace(value)) {
            scanGeneration.current += 1;
            current.current.scanning = false;
            setScanning(false);
            setFocusRequest(count => count + 1);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  contentArea: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 24 },
  phraseField: { width: '100%', maxWidth: 600, alignSelf: 'center' },
  errorMessage: {
    ...typography.secondary,
    color: colors.error,
    marginTop: 16,
  },
  footer: { flexShrink: 0, paddingHorizontal: 24, paddingTop: 12 },
  confirm: {
    ...buttonMetrics.primary,
    borderRadius: 25,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { backgroundColor: colors.neutralButton },
});
