import { inputProps } from '../../../theme/inputTheme';
import { useEffect, useReducer, useRef, useState } from 'react';
import { MenuView } from '@react-native-menu/menu';
import {
  Alert,
  ActionSheetIOS,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useWalletLoader } from '../../../app/providers/WalletLoaderProvider';
import {
  finishWalletEntry,
  useWallets,
} from '../../../app/providers/WalletProvider';
import { BackGlyph, Icon, NativeSymbol } from '../../../components/icons/Icon';
import { useT } from '../../../i18n/index';
import { pasteText, selectionFeedback } from '../../../services/feedback';
import { colors, typography } from '../../../theme/index';
import { QrScannerModal } from '../../send/modals/QrScannerModal';
import { useImportHeader } from '../components/ImportHeaderMenu';
import { PhraseSuggestions } from '../components/PhraseSuggestions';
import { TransactionGlass } from '../../activity/components/TransactionGlass';
import { isKnownWord, PhraseEditor } from '../components/PhraseEditor';
import { usePhraseInputVisibility } from '../hooks/usePhraseInputVisibility';
import { styles } from '../styles/PhraseImportWalletScreen.styles.js';
import { AppBackground } from '../../../components/backgrounds/AppBackground';

function ActionPill({ label, icon, onPress, disabled }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={styles.pill}
      onLayout={({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout;
        setSize(previous =>
          previous.width === width && previous.height === height
            ? previous
            : { width, height },
        );
      }}
    >
      <TransactionGlass
        width={size.width}
        height={size.height}
        radius={size.height / 2}
      />
      {Platform.OS === 'ios' ? (
        <NativeSymbol
          symbolName={
            icon === 'scan' ? 'qrcode.viewfinder' : 'doc.on.clipboard'
          }
          pointSize={14}
          weight="semibold"
          tintColor={colors.foreground}
          style={styles.utilitySymbol}
        />
      ) : icon === 'scan' ? (
        <Icon name="scan" size={16} />
      ) : (
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path
            d={
              icon === 'clear'
                ? 'M4 6H20M9 6V3H15V6M6 6V21H18V6'
                : 'M8 8H21V21H8ZM3 3H16V8M8 16H3V3'
            }
            stroke="white"
            strokeWidth={1.8}
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      )}
      <Text style={styles.utilityLabel}>{label}</Text>
    </Pressable>
  );
}
export function PhraseImportWalletScreen({ navigation }) {
  const t = useT();
  const { importWallet } = useWallets();
  const loader = useWalletLoader();
  const [busy, setBusy] = useState(false);
  const importing = useRef(false);
  const mounted = useRef(true);
  const insets = useSafeAreaInsets();
  const { requestPassphrase } = useImportHeader({
    navigation,
    busy,
    title: t('import.recoveryTitle'),
  });
  const [scanning, setScanning] = useState(false);
  const editor = useRef(new PhraseEditor()).current;
  const input = useRef(null);
  const wordMenu = useRef(null);
  const completedPhrase = useRef('');
  const focusFrame = useRef(null);
  const scroll = useRef(null);
  const activeSlot = useRef(null);
  const visibility = usePhraseInputVisibility(input, scroll, activeSlot);
  const [inputFocused, setInputFocused] = useState(true);
  const [inputError, setInputError] = useState('');
  const [, redraw] = useReducer(value => value + 1, 0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(84);
  const [passphrase, setPassphrase] = useState('');
  const [addressType, setAddressType] = useState(null);
  const [derivationPath, setDerivationPath] = useState('');
  const chooseOption = (title, choices, selected) =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options: [...choices, t('common.cancel')],
        cancelButtonIndex: choices.length,
        userInterfaceStyle: 'dark',
      },
      index => {
        if (index < choices.length) {
          selected(choices[index]);
        }
      },
    );
  const showOptions = () => {
    selectionFeedback();
    const options = [
      passphrase ? t('import.passphraseEnabled') : t('import.usePassphrase'),
      addressType
        ? t('import.addressType', { type: addressType })
        : t('import.addressTypesAutomatic'),
      derivationPath || t('import.defaultDerivationPath'),
    ];
    chooseOption(t('import.options'), options, item => {
      const option = options.indexOf(item);
      if (option === 0) {
        Alert.prompt(
          t('import.bip39Passphrase'),
          t('import.bip39PassphraseMessage'),
          [
            {
              text: t('common.cancel'),
              style: 'cancel',
            },
            {
              text: t('common.save'),
              onPress: value => setPassphrase(value ?? ''),
            },
          ],
          'secure-text',
          passphrase,
        );
      } else if (option === 1) {
        chooseOption(
          t('import.addressTypeTitle'),
          ['Legacy', 'Nested SegWit', 'Native SegWit', 'Taproot'],
          value => {
            setAddressType(value);
            setDerivationPath('');
          },
        );
      } else {
        Alert.prompt(
          t('import.derivationPath'),
          undefined,
          [
            {
              text: t('common.cancel'),
              style: 'cancel',
            },
            {
              text: t('common.save'),
              onPress: value => setDerivationPath(value.trim()),
            },
          ],
          'plain-text',
          derivationPath || "m/84'/0'/0'",
        );
      }
    });
  };
  const { width, height } = useWindowDimensions();
  const rawMode = !editor.isPhrase;
  const validPhrase = editor.isPhrase && editor.canContinue;
  const phraseValue = editor.words.filter(Boolean).join(' ');
  const editingWord = editor.editing;
  const footerInset = keyboardHeight ? 24 : Math.max(insets.bottom, 24);
  const suggestions = inputFocused && !rawMode ? editor.suggestions : [];
  const phraseWords = editor.words.filter(Boolean);
  const showValidation =
    editor.isPhrase &&
    [12, 15, 18, 21, 24].includes(phraseWords.length) &&
    phraseWords.every(isKnownWord);
  const completion = inputFocused ? editor.completionSuffix : '';
  const refresh = () => {
    setInputError('');
    redraw();
  };
  const revealInput = visibility.reveal;
  useEffect(() => {
    mounted.current = true;
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow',
      event => {
        if (Platform.OS === 'ios') {
          Keyboard.scheduleLayoutAnimation(event);
        }
        setKeyboardHeight(Math.max(0, height - event.endCoordinates.screenY));
      },
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      event => {
        if (Platform.OS === 'ios') {
          Keyboard.scheduleLayoutAnimation(event);
        }
        setKeyboardHeight(0);
      },
    );
    const unsubscribe = navigation.addListener('transitionEnd', event => {
      if (!event.data.closing) {
        input.current?.focus();
      }
    });
    return () => {
      mounted.current = false;
      wordMenu.current = null;
      if (focusFrame.current !== null) {
        cancelAnimationFrame(focusFrame.current);
        focusFrame.current = null;
      }
      show.remove();
      hide.remove();
      unsubscribe();
    };
  }, [height, navigation]);
  useEffect(() => () => editor.clear(), [editor]);
  useEffect(() => {
    if (!validPhrase) {
      completedPhrase.current = '';
      return;
    }
    if (
      !inputFocused ||
      editingWord ||
      wordMenu.current ||
      busy ||
      completedPhrase.current === phraseValue
    ) {
      return;
    }
    const timeout = setTimeout(() => {
      if (
        mounted.current &&
        navigation.isFocused() &&
        !wordMenu.current &&
        !editor.editing
      ) {
        completedPhrase.current = phraseValue;
        Keyboard.dismiss();
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [
    validPhrase,
    phraseValue,
    inputFocused,
    editingWord,
    busy,
    navigation,
    editor,
  ]);
  const focus = (selectWord = false) => {
    if (wordMenu.current || !mounted.current || !navigation.isFocused()) {
      return;
    }
    if (focusFrame.current !== null) {
      cancelAnimationFrame(focusFrame.current);
    }
    setInputFocused(true);
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      if (!mounted.current || !navigation.isFocused() || wordMenu.current) {
        return;
      }
      input.current?.focus();
      if (selectWord === true) {
        const selection = { start: 0, end: editor.activeText.length };
        input.current?.setNativeProps({ selection });
        editor.selection = selection;
        redraw();
      }
      revealInput();
    });
  };
  const change = text => {
    const existingLength = editor.isPhrase
      ? editor.words.join(' ').length - editor.activeText.length
      : 0;
    if (text.length + existingLength > 16384) {
      return;
    }
    if (editor.isPhrase && editor.editing && editor.activeText && !text) {
      editor.remove(editor.active);
    } else {
      editor.change(text);
    }
    refresh();
  };
  const paste = async () => {
    selectionFeedback();
    let text;
    try {
      text = await pasteText();
    } catch {
      Alert.alert(t('import.pasteFailed'), t('import.pasteAccess'), [
        {
          text: t('common.ok'),
        },
      ]);
      return;
    }
    if (!mounted.current || !navigation.isFocused()) {
      return;
    }
    if (text.length > 16384) {
      Alert.alert(t('import.inputAlertTitle'), t('import.inputLimit'));
      return;
    }
    if (!text.trim()) {
      Alert.alert(t('import.nothingToPaste'), t('import.pasteEmpty'), [
        {
          text: t('common.ok'),
        },
      ]);
      return;
    }
    editor.paste(text);
    refresh();
    focus();
  };
  const edit = (id, action) => {
    const index = editor.ids.indexOf(id);
    if (index < 0 || busy) {
      return;
    }
    selectionFeedback();
    if (action === 'remove') {
      editor.remove(index);
    } else {
      editor.focus(index);
    }
    refresh();
    focus(action === 'edit');
  };
  const openWordMenu = id => {
    wordMenu.current = {
      id,
      restoreFocus: input.current?.isFocused() ?? false,
    };
  };
  const chooseWordAction = (id, action) => {
    if (action !== 'edit' && action !== 'remove') {
      return;
    }
    wordMenu.current = { ...wordMenu.current, id, action };
  };
  const closeWordMenu = id => {
    const request = wordMenu.current;
    if (!request || request.id !== id) {
      return;
    }
    wordMenu.current = null;
    if (!mounted.current || busy || !navigation.isFocused()) {
      return;
    }
    if (request.action) {
      edit(id, request.action);
    } else if (request.restoreFocus) {
      focus();
    }
  };
  const field = (
    <View
      style={[
        styles.inputMeasure,
        rawMode && styles.rawMeasure,
        {
          maxWidth: width - 104,
          ...(rawMode && { width: width - 80, maxWidth: width - 80 }),
        },
      ]}
    >
      <Text
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={[styles.wordText, styles.measure]}
      >
        {editor.activeText + completion || ' '}
      </Text>
      {!!completion && (
        <Text
          pointerEvents="none"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          numberOfLines={1}
          style={[styles.wordText, styles.completion]}
        >
          <Text style={styles.transparentText}>{editor.activeText}</Text>
          <Text style={styles.completionText}>{completion}</Text>
        </Text>
      )}
      <TextInput
        {...inputProps}
        ref={input}
        editable={!busy}
        selectionColor={colors.button}
        cursorColor={colors.button}
        accessibilityLabel={t('import.inputLabel')}
        onFocus={() => {
          setInputFocused(true);
          revealInput();
        }}
        onBlur={() => {
          setInputFocused(false);
          editor.finish();
          redraw();
        }}
        onLayout={() => {
          if (inputFocused && !busy) {
            revealInput();
          }
        }}
        value={editor.activeText}
        onChangeText={change}
        onSelectionChange={event => {
          const selection = event.nativeEvent.selection;
          if (
            selection.end <= editor.activeText.length &&
            (selection.start !== editor.selection?.start ||
              selection.end !== editor.selection?.end)
          ) {
            editor.selection = selection;
            redraw();
          }
        }}
        onSubmitEditing={() => {
          selectionFeedback();
          editor.submit(completion);
          refresh();
          focus();
        }}
        onKeyPress={event => {
          if (
            event.nativeEvent.key === 'Backspace' &&
            editor.isPhrase &&
            !editor.activeText
          ) {
            editor.backspace();
            input.current?.setNativeProps({ selection: editor.selection });
            refresh();
            focus();
          }
        }}
        maxLength={16384}
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="none"
        textContentType="none"
        returnKeyType="done"
        submitBehavior="submit"
        keyboardType="ascii-capable"
        multiline={rawMode}
        style={[styles.wordText, styles.input, rawMode && styles.rawInput]}
      />
    </View>
  );
  const active = (
    <Pressable
      accessible={false}
      disabled={busy}
      onPress={() => focus()}
      key="active"
      ref={activeSlot}
      collapsable={false}
      style={[
        styles.capsule,
        styles.activeCapsule,
        editor.editing && styles.editing,
        rawMode && styles.rawCapsule,
      ]}
    >
      {!rawMode && (
        <Text style={styles.wordNumber}>{editor.position(editor.active)}</Text>
      )}
      {field}
    </Pressable>
  );
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <AppBackground />
      <SafeAreaView
        style={styles.safeArea}
        edges={Platform.OS === 'ios' ? [] : ['top']}
      >
        {Platform.OS !== 'ios' && (
          <View style={styles.toolbar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              onPress={() => navigation.goBack()}
              style={styles.toolbarButton}
            >
              <BackGlyph />
            </Pressable>
            <Text accessibilityRole="header" style={styles.navigationTitle}>
              {t('import.recoveryTitle')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('import.options')}
              onPress={showOptions}
              style={styles.toolbarButton}
            >
              <Icon name="more" size={22} />
            </Pressable>
          </View>
        )}
        <View
          onLayout={visibility.onViewportLayout}
          style={[
            styles.viewport,
            { marginBottom: keyboardHeight + footerHeight },
          ]}
        >
          <ScrollView
            ref={scroll}
            onScroll={visibility.onScroll}
            onContentSizeChange={visibility.onContentSizeChange}
            onScrollBeginDrag={visibility.onScrollBeginDrag}
            onScrollEndDrag={visibility.onScrollEndDrag}
            onMomentumScrollBegin={visibility.onMomentumScrollBegin}
            onMomentumScrollEnd={visibility.onMomentumScrollEnd}
            automaticallyAdjustKeyboardInsets={false}
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              accessible={false}
              disabled={busy}
              onPress={() => focus()}
              style={styles.phraseField}
            >
              {!editor.hasContent && !inputFocused && (
                <Text style={styles.placeholder}>{t('import.tapToEnter')}</Text>
              )}
              <View accessible={false} style={styles.words}>
                {editor.words.map((word, index) => {
                  if (index === editor.active) {
                    return !inputFocused && !word ? null : active;
                  }
                  if (!word) {
                    return null;
                  }
                  const wordId = editor.ids[index];
                  const label = (
                    <View
                      style={[
                        styles.capsule,
                        isKnownWord(word)
                          ? styles.validCapsule
                          : styles.invalidCapsule,
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.wordNumber,
                          !isKnownWord(word) && styles.invalidWordText,
                        ]}
                      >
                        {editor.position(index)}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.wordText,
                          styles.committedWord,
                          !isKnownWord(word) && styles.invalidWordText,
                        ]}
                      >
                        {word}
                      </Text>
                    </View>
                  );
                  return (
                    <MenuView
                      key={wordId}
                      style={styles.wordSlot}
                      themeVariant="dark"
                      shouldOpenOnLongPress={false}
                      onOpenMenu={() => openWordMenu(wordId)}
                      onCloseMenu={() => closeWordMenu(wordId)}
                      onPressAction={({ nativeEvent }) =>
                        chooseWordAction(wordId, nativeEvent.event)
                      }
                      actions={[
                        {
                          id: 'edit',
                          title: t('import.editWord'),
                          image: 'pencil',
                          attributes: { disabled: busy },
                        },
                        {
                          id: 'remove',
                          title: t('import.clear'),
                          image: 'trash',
                          attributes: { destructive: true, disabled: busy },
                        },
                      ]}
                    >
                      <View
                        accessibilityRole="button"
                        accessibilityLabel={`${editor.position(
                          index,
                        )}. ${word}`}
                      >
                        {label}
                      </View>
                    </MenuView>
                  );
                })}
              </View>
            </Pressable>
            {!!inputError && (
              <Text accessibilityRole="alert" style={styles.errorMessage}>
                {inputError}
              </Text>
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.utilities}
            >
              <ActionPill
                label={t('import.paste')}
                disabled={busy}
                icon="paste"
                onPress={paste}
              />
              <ActionPill
                label={t('import.scan')}
                disabled={busy}
                icon="scan"
                onPress={() => {
                  Keyboard.dismiss();
                  setScanning(true);
                }}
              />
            </ScrollView>
            {showValidation && (
              <View style={styles.validation}>
                <NativeSymbol
                  symbolName={
                    validPhrase
                      ? 'checkmark.circle.fill'
                      : 'exclamationmark.triangle.fill'
                  }
                  pointSize={15}
                  weight="semibold"
                  tintColor={validPhrase ? colors.button : colors.error}
                  style={styles.validationSymbol}
                />
                <Text
                  accessibilityRole="alert"
                  style={[
                    styles.validationText,
                    { color: validPhrase ? colors.button : colors.error },
                  ]}
                >
                  {t(
                    validPhrase
                      ? 'import.validPhrase'
                      : 'import.invalidChecksum',
                  )}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
        <View
          style={[styles.footer, { bottom: keyboardHeight }]}
          onLayout={({ nativeEvent }) =>
            setFooterHeight(nativeEvent.layout.height)
          }
        >
          <View
            style={[
              styles.footerContent,
              {
                paddingBottom: footerInset,
              },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              disabled={!editor.canContinue || busy}
              accessibilityState={{
                disabled: !editor.canContinue || busy,
              }}
              onPress={async () => {
                if (importing.current || busy) {
                  return;
                }
                importing.current = true;
                const importPassphrase =
                  Platform.OS === 'ios'
                    ? await requestPassphrase()
                    : passphrase;
                if (importPassphrase === null || !navigation.isFocused()) {
                  importing.current = false;
                  return;
                }
                selectionFeedback();
                setBusy(true);
                try {
                  const material = editor.isPhrase
                    ? editor.words.filter(Boolean).join(' ')
                    : editor.raw;
                  loader.enter(t('import.loading'));
                  await importWallet(material, {
                    passphrase: importPassphrase,
                    addressType,
                    derivationPath,
                  });
                  editor.clear();
                  setPassphrase('');
                  if (mounted.current && navigation.isFocused()) {
                    finishWalletEntry(navigation);
                  }
                } catch (error) {
                  loader.exit();
                  if (mounted.current && navigation.isFocused()) {
                    setInputError(error.message);
                    focus();
                  }
                } finally {
                  importing.current = false;
                  if (mounted.current) {
                    setBusy(false);
                  }
                }
              }}
              style={[
                styles.confirm,
                (!editor.canContinue || busy) && styles.disabled,
              ]}
            >
              <Text
                style={[
                  typography.button,
                  {
                    color: editor.canContinue
                      ? colors.onButton
                      : colors.secondary,
                  },
                ]}
              >
                {t('common.continue')}
              </Text>
            </Pressable>
            {suggestions.length > 0 && (
              <PhraseSuggestions
                words={suggestions}
                disabled={busy}
                onSelect={word => {
                  selectionFeedback();
                  editor.choose(word);
                  refresh();
                  focus();
                }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
      <QrScannerModal
        visible={scanning}
        raw
        onClose={() => setScanning(false)}
        onScanned={value => {
          if (value.length > 16384) {
            Alert.alert(t('import.inputAlertTitle'), t('import.inputLimit'));
            return;
          }
          editor.paste(value);
          refresh();
          setScanning(false);
        }}
      />
    </View>
  );
}
