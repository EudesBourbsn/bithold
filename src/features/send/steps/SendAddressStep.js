import { inputProps } from '../../../theme/inputTheme';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useAddressBubble } from '../../../components/feedback/AddressBubble';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { readClipboard } from '../../../services/feedback';
import { colors, typography } from '../../../theme/index';
import { navigationMetrics } from '../../../theme/navigationMetrics';
import { bitcoinAsset } from '../../activity/components/TransactionHero';
import { validBitcoinAddress } from '../domain/address';
import { sendFeedbackColors } from '../styles/sendFeedback';
import { NOTE_LIMIT, styles } from '../styles/SendAddressStep.styles.js';

export function SendAddressStep({
  address,
  setAddress,
  note,
  setNote,
  onContinue,
  onScan,
}) {
  const t = useT();
  const showBubble = useAddressBubble();
  const hintAnchor = useRef(null);
  const { selectedWallet } = useWallets();
  const network = selectedWallet?.network ?? 'Mainnet';
  const [manual, setManual] = useState(false),
    [message, setMessage] = useState(null),
    [inputHeight, setInputHeight] = useState(19);
  const input = useRef(null),
    lastTap = useRef(0),
    lastCopy = useRef(null),
    reading = useRef(false),
    queued = useRef(null),
    emptyTap = useRef(false),
    mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const edit = () => {
    setManual(true);
    emptyTap.current = false;
    setMessage(null);
    requestAnimationFrame(() => input.current?.focus());
  };
  const tap = async forced => {
    const now = Date.now(),
      double = forced ?? now - lastTap.current <= 300;
    lastTap.current = double ? 0 : now;
    if (reading.current) {
      queued.current = double;
      return;
    }
    reading.current = true;
    try {
      const data = await readClipboard();
      if (!mounted.current) {
        return;
      }
      const text = data.text.trim().replace(/[\r\n]/g, '');
      if (!text) {
        if (manual) {
          return;
        }
        if (double || emptyTap.current) {
          edit();
        } else {
          emptyTap.current = true;
          if (!address) {
            setMessage(t('send.clipboardEmpty'));
          }
        }
        return;
      }
      const fresh = lastCopy.current?.changeCount !== data.changeCount;
      lastCopy.current = data;
      emptyTap.current = false;
      if (double && !fresh && address) {
        edit();
        return;
      }
      Keyboard.dismiss();
      setManual(false);
      setMessage(null);
      setAddress(text);
    } catch {
      if (mounted.current) {
        emptyTap.current = true;
        setMessage(t('send.pasteFailed'));
      }
    } finally {
      reading.current = false;
      if (queued.current !== null) {
        const next = queued.current;
        queued.current = null;
        if (mounted.current) {
          if (next) {
            edit();
          } else {
            tap(false);
          }
        }
      }
    }
  };
  const valid = !!address.trim() && validBitcoinAddress(address, network),
    error = address.trim() && !valid ? t('send.invalidAddress') : message;
  return (
    <View>
      <SheetHeader />
      <View style={styles.iconGap} />
      <View style={styles.icon}>
        <Image
          source={bitcoinAsset}
          style={styles.asset}
          resizeMode="contain"
          accessible={false}
        />
        <Text
          accessibilityRole="header"
          style={[typography.sheetTitle, styles.title]}
        >
          {t('send.title')}
        </Text>
      </View>
      <View style={styles.iconGap} />
      <View style={styles.content}>
        <View style={styles.field}>
          {manual ? (
            <TextInput
              {...inputProps}
              ref={input}
              accessibilityLabel={t('send.addressLabel')}
              value={address}
              multiline
              autoCorrect={false}
              spellCheck={false}
              autoCapitalize="none"
              returnKeyType="done"
              submitBehavior="blurAndSubmit"
              placeholder={t('send.addressPlaceholder')}
              onContentSizeChange={e =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              onChangeText={text => {
                setMessage(null);
                emptyTap.current = false;
                setAddress(text.replace(/[\r\n]/g, ''));
              }}
              onBlur={() => setManual(false)}
              style={[
                typography.input,
                styles.manualInput,
                {
                  height: Math.max(19, inputHeight),
                },
              ]}
            />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={address || t('send.addressPlaceholder')}
              onPress={() => tap()}
              style={styles.fieldText}
            >
              <Text style={[typography.input, !address && styles.placeholder]}>
                {address || t('send.addressPlaceholder')}
              </Text>
            </Pressable>
          )}
          {valid ? (
            <View style={styles.valid}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Circle cx={12} cy={12} r={10} fill="#8AC9AE" />
                <Path
                  d="m7 12 3 3 7-7"
                  fill="none"
                  stroke={colors.input}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('send.scanLabel')}
              hitSlop={navigationMetrics.hitSlop}
              onPress={onScan}
              style={styles.scan}
            >
              <Svg width={18} height={18} viewBox="0 0 18 18">
                <Rect
                  x={0.5}
                  y={0.5}
                  width={7}
                  height={7}
                  fill="none"
                  stroke={colors.foreground}
                />
                <Rect
                  x={3}
                  y={3}
                  width={2}
                  height={2}
                  fill={colors.foreground}
                />
                <Rect
                  x={10.5}
                  y={0.5}
                  width={7}
                  height={7}
                  fill="none"
                  stroke={colors.foreground}
                />
                <Rect
                  x={0.5}
                  y={10.5}
                  width={7}
                  height={7}
                  fill="none"
                  stroke={colors.foreground}
                />
                <Path
                  d="M10 10h7v1h-7zM17 11h1v5h-1zM13 17h5v1h-5zM10 13h1v5h-1zM11 14h4v1h-4zM14 12h1v2h-1z"
                  fill={colors.foreground}
                />
              </Svg>
            </Pressable>
          )}
        </View>
        {!!error && (
          <View accessibilityLiveRegion="polite" style={styles.error}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Circle cx={12} cy={12} r={11} fill={sendFeedbackColors.icon} />
              <Path
                d="M12 10v7M12 6v1"
                stroke={sendFeedbackColors.background}
                strokeWidth={2.3}
              />
            </Svg>
            <Text style={[typography.inputError, styles.errorText]}>
              {error}
            </Text>
          </View>
        )}
        <View style={styles.fieldGap} />
        <View style={styles.field}>
          <TextInput
            {...inputProps}
            accessibilityLabel={t('send.notePlaceholder')}
            value={note}
            maxLength={NOTE_LIMIT}
            autoCorrect={false}
            returnKeyType="done"
            placeholder={t('send.notePlaceholder')}
            onChangeText={setNote}
            style={[typography.input, styles.noteInput]}
          />
          <Text style={styles.optional}>{t('send.noteOptional')}</Text>
          <Pressable
            ref={hintAnchor}
            accessibilityRole="button"
            accessibilityLabel={t('send.noteHint')}
            hitSlop={navigationMetrics.hitSlop}
            onPress={() =>
              hintAnchor.current?.measureInWindow((x, y, width, height) =>
                showBubble(t('send.noteHint'), { x, y, width, height }, false, {
                  duration: null,
                  info: true,
                }),
              )
            }
            style={styles.hint}
          >
            <Svg width={22} height={22} viewBox="0 0 22 22">
              <Defs>
                <LinearGradient id="noteHint" x1="0" y1="1" x2="0" y2="0">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.05} />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.1} />
                </LinearGradient>
              </Defs>
              <Circle cx={11} cy={11} r={11} fill="url(#noteHint)" />
              <Circle cx={11} cy={6.9} r={1.3} fill="#FFFFFF" />
              <Path
                d="M9.6 9.6h2.3v5.2h1.2v1.4H9.4v-1.4h1.1v-3.8h-0.9z"
                fill="#FFFFFF"
              />
            </Svg>
          </Pressable>
        </View>
        <View style={styles.buttonGap} />
        <SheetButton
          disabled={!valid}
          onPress={() => onContinue(address.trim())}
        />
      </View>
      <View style={styles.bottom} />
    </View>
  );
}
