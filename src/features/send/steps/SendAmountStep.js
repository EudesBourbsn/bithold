import { inputProps } from '../../../theme/inputTheme';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { typography } from '../../../theme/index';
import { defaultFeeRate } from '../../../wallet/network/fees';
import { AddressCapsule } from '../components/AddressCapsule';
import { AmountGlyphMetrics } from '../components/AmountGlyphMetrics';
import {
  AnimatedAmountDigits,
  digitWidth,
  glyphUnits,
} from '../components/AnimatedAmountDigits';
import { SendGlassWarning } from '../components/SendGlassWarning';
import {
  bitcoin,
  bitcoinLabel,
  fiat,
  currencySymbol,
  currencyDigits,
  maximumSatoshis,
  normalizeAmountInput,
  parseAmount,
  unitName,
} from '../domain/amount';
import { styles } from '../styles/SendAmountStep.styles.js';

// The Bitcoin mark the Receive sheet shows on its QR code.
const bitcoinMark = require('../../../../assets/icons/bitcoin-mark.png');

const AnimatedInput = Animated.createAnimatedComponent(TextInput);
export function SendAmountStep({
  address,
  draft,
  onBack,
  onContinue,
  onDraft,
  busy,
}) {
  const t = useT();
  const { width: windowWidth } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(null);
  const [glyphAdvances, setGlyphAdvances] = useState(null);
  const width = Math.min(windowWidth, contentWidth ?? windowWidth);
  const { selectedWallet, quote, preferences, engine, fees, market, network } =
    useWallets();
  const currency = draft?.currency ?? preferences.currency;
  // Test networks' coins have no price.
  const liveQuote =
    network !== 'Mainnet'
      ? null
      : market?.quotes?.[currency] ??
        (currency === preferences.currency ? quote : null);
  const [conversionQuote, setConversionQuote] = useState(
    draft?.conversionQuote ?? liveQuote,
  );
  const availableSats =
    selectedWallet?.snapshot?.coins
      .filter(
        c =>
          !c.coinbase ||
          (c.height > 0 && selectedWallet.snapshot.tip - c.height + 1 >= 100),
      )
      .reduce((sum, c) => sum + c.value, 0) ?? null;
  const [sendMax, setSendMax] = useState(draft?.sendMax ?? false);
  const [text, setText] = useState(draft?.enteredAmount ?? '0'),
    [fiatMode, setFiatMode] = useState(draft?.isFiat ?? false),
    [satoshis, setSatoshis] = useState(draft?.satoshis ?? 0),
    [feeBitcoin, setFeeBitcoin] = useState(false);
  const fiatPerBitcoin = fiatMode ? conversionQuote : liveQuote;
  const input = useRef(null),
    font = useSharedValue(88);
  const content = text || '0',
    proposed = Math.min(
      88,
      Math.floor((width * width) / 400 / Math.max(1, text.length)),
    );
  const fiatDecimals = currencyDigits(currency);
  const prefixWidth = fiatMode
    ? Math.max(18, currencySymbol(currency).length * 12)
    : 29;
  const units = glyphUnits(content, glyphAdvances);
  const measured = digitWidth(content, proposed, glyphAdvances),
    available = Math.max(42, width - 40 - prefixWidth - 32);
  const target =
    measured <= available ? proposed : (proposed * available) / measured;
  useEffect(() => {
    font.value = withSpring(target, {
      mass: 1,
      stiffness: 100,
      damping: 10,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    });
  }, [font, target]);
  useEffect(() => {
    onDraft({
      enteredAmount: text,
      sendMax,
      isFiat: fiatMode,
      currency,
      conversionQuote,
      satoshis,
      address,
      feeRate: draft?.feeRate ?? null,
      rbf: draft?.rbf ?? true,
      networkFeeSatoshis: draft?.networkFeeSatoshis ?? null,
    });
  }, [
    text,
    fiatMode,
    currency,
    conversionQuote,
    satoshis,
    sendMax,
    address,
    draft?.feeRate,
    draft?.rbf,
    draft?.networkFeeSatoshis,
    onDraft,
  ]);
  const inputStyle = useAnimatedStyle(() => ({
    fontSize: font.value,
    lineHeight: (font.value * 105) / 88,
    letterSpacing: -0.02 * target,
    width: Math.min(
      Math.max(units * font.value - content.length * 0.02 * target + 32, 42),
      width - 40 - prefixWidth,
    ),
    height: (font.value * 105) / 88,
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    height: (font.value * 105) / 88,
    width: Math.min(
      Math.max(units * font.value - content.length * 0.02 * target + 32, 42),
      width - 40 - prefixWidth,
    ),
  }));
  const changed = value => {
    if (busy) {
      return;
    }
    value = normalizeAmountInput(value);
    const pattern = fiatMode
      ? new RegExp(
          `^\\d{0,26}${fiatDecimals ? `(?:\\.\\d{0,${fiatDecimals}})?` : ''}$`,
        )
      : /^\d{0,8}(?:\.\d{0,8})?$/;
    if (!pattern.test(value)) {
      return;
    }
    setText(value);
    setSendMax(false);
    const editQuote =
      Number.isFinite(liveQuote) && liveQuote > 0 ? liveQuote : conversionQuote;
    if (fiatMode && editQuote) {
      setConversionQuote(editQuote);
    }
    setSatoshis(parseAmount(value, fiatMode, editQuote));
  };
  const swap = () => {
    if (busy) {
      return;
    }
    if (!fiatMode && !fiatPerBitcoin) {
      Alert.alert(
        t('send.priceUnavailable'),
        t('send.priceUnavailableMessage'),
      );
      return;
    }
    Keyboard.dismiss();
    impactFeedback();
    if (!fiatMode) {
      setConversionQuote(liveQuote);
    }
    setFiatMode(v => !v);
    setText(
      fiatMode
        ? bitcoin(satoshis)
        : ((satoshis / 100000000) * fiatPerBitcoin).toFixed(fiatDecimals),
    );
  };
  const preview = useMemo(() => {
    if (!selectedWallet?.id || !selectedWallet?.snapshot || satoshis < 546) {
      return null;
    }
    try {
      return {
        fee: engine.preview(selectedWallet.id, {
          address,
          satoshis,
          sendMax,
          rbf: draft?.rbf ?? true,
          feeRate: draft?.feeRate ?? defaultFeeRate(fees),
        }).networkFeeSatoshis,
      };
    } catch (error) {
      return { error: error?.message ?? '', code: error?.code };
    }
  }, [
    engine,
    selectedWallet?.id,
    selectedWallet?.snapshot,
    address,
    satoshis,
    sendMax,
    draft?.rbf,
    draft?.feeRate,
    fees,
  ]);
  const fee = preview?.fee ?? null;
  const dustValue = fiatPerBitcoin
    ? `${fiat((546 / 100000000) * fiatPerBitcoin, currency)} (${bitcoinLabel(
        546,
      )})`
    : bitcoinLabel(546);
  const warning =
    (satoshis > 0 && satoshis < 546) || preview?.code === 'dust'
      ? t('send.dustWarning', { amount: dustValue })
      : (availableSats != null && satoshis > availableSats) ||
        preview?.code === 'insufficient'
      ? t('send.insufficientWarning')
      : null;
  const [shownWarning, setShownWarning] = useState(warning);
  useEffect(() => {
    if (warning) {
      setShownWarning(warning);
    }
  }, [warning]);
  // Its footer fades the Send button out and the warning in, 200 ms each.
  const hasWarning = !!warning;
  const warningProgress = useSharedValue(hasWarning ? 1 : 0);
  useEffect(() => {
    warningProgress.value = withTiming(hasWarning ? 1 : 0, { duration: 200 });
  }, [hasWarning, warningProgress]);
  const buttonFade = useAnimatedStyle(() => ({
    opacity: 1 - warningProgress.value,
  }));
  const warningFade = useAnimatedStyle(() => ({
    opacity: warningProgress.value,
  }));
  // The card is centred on the button's slot at its own height, so a two
  // line warning keeps clear of the fee above it.
  const [slotHeight, setSlotHeight] = useState(0);
  const [warningHeight, setWarningHeight] = useState(0);
  return (
    <View onLayout={event => setContentWidth(event.nativeEvent.layout.width)}>
      {!glyphAdvances && <AmountGlyphMetrics onMeasured={setGlyphAdvances} />}
      <SheetHeader onBack={onBack} />
      <View style={styles.heroGap} />
      <View style={styles.amountRow}>
        {fiatMode ? (
          <Text style={typography.amountUnit}>{currencySymbol(currency)}</Text>
        ) : (
          <Image
            source={bitcoinMark}
            accessibilityIgnoresInvertColors
            style={styles.bitcoinMark}
          />
        )}
        <View style={styles.prefixGap} />
        <Animated.View style={overlayStyle}>
          <AnimatedInput
            {...inputProps}
            ref={input}
            accessibilityLabel={
              fiatMode
                ? t('send.amountInCurrency', { currency })
                : t('send.amountInBitcoin')
            }
            value={text}
            editable={!busy}
            keyboardType="decimal-pad"
            onChangeText={changed}
            onFocus={() => {
              if (Number(text) === 0) {
                input.current?.setSelection(0, text.length);
              }
            }}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            style={[styles.hiddenInput, inputStyle]}
          />
          {glyphAdvances && (
            <AnimatedAmountDigits
              text={content}
              fontSize={font}
              target={target}
              advances={glyphAdvances}
            />
          )}
        </Animated.View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('send.switchCurrency', { currency })}
        disabled={busy}
        onPress={swap}
        style={styles.conversion}
      >
        {fiatMode && (
          <Image
            source={bitcoinMark}
            accessibilityIgnoresInvertColors
            style={styles.conversionMark}
          />
        )}
        <Text style={typography.conversion}>
          {fiatMode
            ? bitcoinLabel(satoshis)
            : fiat(
                fiatPerBitcoin ? (satoshis / 100000000) * fiatPerBitcoin : null,
                currency,
              )}
        </Text>
      </Pressable>
      <View style={styles.optionsGap} />
      <View style={styles.options}>
        <AddressCapsule address={address} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('send.useAvailable')}
          disabled={busy}
          onPress={() => {
            if (busy || availableSats == null) {
              return;
            }
            setSendMax(true);
            setSatoshis(availableSats);
            setText(
              fiatMode && fiatPerBitcoin
                ? ((availableSats / 100000000) * fiatPerBitcoin).toFixed(
                    fiatDecimals,
                  )
                : bitcoin(availableSats),
            );
          }}
          onLongPress={() => {
            if (busy || availableSats == null) {
              return;
            }
            setSendMax(true);
            setSatoshis(availableSats);
            setText(
              fiatMode && fiatPerBitcoin
                ? ((availableSats / 100000000) * fiatPerBitcoin).toFixed(
                    fiatDecimals,
                  )
                : bitcoin(availableSats),
            );
          }}
          style={styles.available}
        >
          <Text style={styles.availableText}>
            {availableSats == null
              ? '—'
              : fiatPerBitcoin
              ? fiat((availableSats / 100000000) * fiatPerBitcoin, currency)
              : bitcoinLabel(availableSats)}
          </Text>
          <Text style={[styles.availableText, styles.availableLabel]}>
            {' '}
            {t('send.available')}
          </Text>
        </Pressable>
      </View>
      <View style={styles.feeGap} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('send.networkFee')}
        onPress={() => {
          impactFeedback();
          setFeeBitcoin(v => !v);
        }}
        style={styles.feePill}
      >
        <Svg width="100%" height={25} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="feeEdge" x1="0" y1="0" x2="1" y2="1">
              <Stop stopColor="#AAAAF2" stopOpacity={0.3} />
              <Stop offset="1" stopColor="#AAAAF2" stopOpacity={0.1} />
            </LinearGradient>
          </Defs>
          <Path
            d="M12.5 24.5A12 12 0 0 1 .5 12.5A12 12 0 0 1 12.5 .5"
            fill="none"
            stroke="url(#feeEdge)"
            strokeWidth={1}
          />
        </Svg>
        <Text style={styles.feeLabel}>{t('send.networkFee')}</Text>
        <Text style={styles.feeValue}>
          {fee == null
            ? feeBitcoin
              ? `— ${unitName()}`
              : `— ${currency}`
            : feeBitcoin
            ? bitcoinLabel(fee)
            : fiat(
                fiatPerBitcoin ? (fee / 100000000) * fiatPerBitcoin : null,
                currency,
              )}
        </Text>
      </Pressable>
      <View style={styles.buttonGap} />
      <View
        style={styles.button}
        onLayout={({ nativeEvent }) => setSlotHeight(nativeEvent.layout.height)}
      >
        <Animated.View
          style={buttonFade}
          pointerEvents={hasWarning ? 'none' : 'auto'}
        >
          <SheetButton
            disabled={
              busy ||
              selectedWallet?.watchOnly ||
              availableSats == null ||
              satoshis < 546 ||
              satoshis > maximumSatoshis ||
              satoshis > availableSats
            }
            onPress={() => {
              Keyboard.dismiss();
              onContinue({
                enteredAmount: text,
                sendMax,
                isFiat: fiatMode,
                currency,
                conversionQuote,
                satoshis,
                address,
                feeRate: draft?.feeRate ?? null,
                rbf: draft?.rbf ?? true,
                networkFeeSatoshis: fee ?? null,
              });
            }}
          />
        </Animated.View>
        <Animated.View
          pointerEvents={hasWarning ? 'auto' : 'none'}
          onLayout={({ nativeEvent }) =>
            setWarningHeight(nativeEvent.layout.height)
          }
          style={[
            styles.warning,
            { top: (slotHeight - warningHeight) / 2 },
            warningFade,
          ]}
        >
          {!!shownWarning && (
            <SendGlassWarning message={warning ?? shownWarning} />
          )}
        </Animated.View>
      </View>
      <View style={styles.bottom} />
    </View>
  );
}
