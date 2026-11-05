import { useState, useEffect, useMemo } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { useSheetScrollGesture } from '../../../components/sheets/SheetGestureContext';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { typography } from '../../../theme/index';
import { freshPreparationSnapshot } from '../../../wallet/domain/snapshot';
import {
  defaultFeeRate,
  feePresentation,
  feeRange,
  feeSnapPoints,
  freshFees,
  normalizeFeeInput,
  parseFeeRate,
  sendFeeRate,
} from '../../../wallet/network/fees';
import { FeeRateInput } from '../components/FeeRateInput';
import { NetworkFeeIllustration } from '../components/NetworkFeeIllustration';
import { fiat, rateLabel, bitcoinLabel, unitName } from '../domain/amount';
import { styles } from '../styles/NetworkFeeStep.styles.js';

const tiers = ['#FE621A', '#FFAD18', '#6ACB62', '#4BE584', '#4FEDBD'];
const starts = ['#FE621A', '#FFC919', '#8ED246', '#46D252', '#57E355'];
const ends = ['#FE621A', '#FF9619', '#46D27E', '#4EED98', '#4EEDC0'];
function positionFor(rate, points) {
  const segments = Math.max(1, points.length - 1);
  for (let i = 0; i < points.length - 1; i++) {
    if (rate <= points[i + 1]) {
      return (
        (i +
          Math.max(
            0,
            Math.min(1, (rate - points[i]) / (points[i + 1] - points[i] || 1)),
          )) /
        segments
      );
    }
  }
  return 1;
}
export function NetworkFeeStep({ draft, onBack, onConfirm, busy }) {
  const t = useT();
  const nativeScroll = useSheetScrollGesture();
  const { fees, quote, preferences, market, engine, selectedWallet, network } =
    useWallets();
  const currency = draft.currency ?? preferences.currency;
  // Test networks' coins have no price.
  const fiatPerBitcoin =
    network !== 'Mainnet'
      ? null
      : draft.isFiat
      ? draft.conversionQuote ?? quote
      : market?.quotes?.[currency] ??
        (currency === preferences.currency ? quote : null);
  const available = freshFees(fees);
  const [rbf, setRbf] = useState(draft.rbf ?? true);
  const range = available ? feeRange(fees) : null;

  const points = useMemo(
    () => (available ? feeSnapPoints(feeRange(fees)) : [defaultFeeRate(fees)]),
    [fees, available],
  );

  const initialRate =
    draft.feeRate == null || (range && draft.feeRate === defaultFeeRate(fees))
      ? range?.recommended ?? defaultFeeRate(fees)
      : draft.feeRate;

  const [text, setText] = useState(
      !available && draft.feeRate == null ? '' : rateLabel(initialRate),
    ),
    [position, setPosition] = useState(positionFor(initialRate, points));
  useEffect(() => {
    engine.refreshMarketDetails().catch(() => {});
    if (
      selectedWallet?.id &&
      !freshPreparationSnapshot(selectedWallet.snapshot)
    ) {
      engine.refresh(selectedWallet.id).catch(() => {});
    }
  }, [engine, selectedWallet?.id, selectedWallet?.snapshot]);
  const [trackWidth, setTrackWidth] = useState(0);
  const parsed = parseFeeRate(text);
  const inRange =
    parsed != null && (!range || (parsed >= range.min && parsed <= range.max));
  const value = inRange ? parsed : null,
    valid = value != null;
  const sending = valid ? sendFeeRate(value, fees) : null;

  const typed = /^\d+(?:\.\d*)?$/.test(text) ? Number(text) : null;
  const rangeError = !text
    ? null
    : typed == null
    ? t('fee.enterValid')
    : range && typed < range.min
    ? t('fee.minimum', { rate: rateLabel(range.min) })
    : range && typed > range.max
    ? t('fee.maximum', { rate: rateLabel(range.max) })
    : parsed == null
    ? t('fee.enterValid')
    : null;
  useEffect(() => {
    setPosition(positionFor(Number(text), points));
  }, [text, points]);
  const presentation = feePresentation(value, fees);
  const tier = presentation.tier,
    color = tiers[tier];

  const preview = useMemo(() => {
    if (!valid || !selectedWallet?.id || !selectedWallet?.snapshot) {
      return null;
    }
    try {
      return engine.preview(selectedWallet.id, {
        ...draft,
        feeRate: sending,
        rbf,
      });
    } catch (error) {
      return {
        error:
          error.code === 'insufficient'
            ? t('send.insufficientWarning')
            : error.message,
      };
    }
  }, [
    engine,
    selectedWallet?.id,
    selectedWallet?.snapshot,
    draft,
    sending,
    valid,
    rbf,
    t,
  ]);
  const segments = Math.max(1, points.length - 1);

  const pick = p => {
    if (!available || busy) {
      return;
    }
    const index = Math.round(Math.max(0, Math.min(1, p)) * segments);
    setPosition(index / segments);
    setText(rateLabel(points[index]));
  };
  const pickAt = x => pick((x - 30) / Math.max(1, trackWidth - 60));
  const snapAt = x => {
    pickAt(x);
    impactFeedback();
  };
  const pan = usePanGesture({
    block: nativeScroll,
    runOnJS: true,
    activeOffsetX: [-4, 4],
    failOffsetY: [-8, 8],
    onActivate: event => pickAt(event.x),
    onUpdate: event => pickAt(event.x),
    onDeactivate: event => {
      if (!event.canceled) {
        snapAt(event.x);
      }
    },
  });
  const tap = useTapGesture({
    block: nativeScroll,
    runOnJS: true,
    onDeactivate: event => {
      if (!event.canceled) {
        snapAt(event.x);
      }
    },
  });
  const sliderGesture = useCompetingGestures(pan, tap);
  const center = 30 + position * Math.max(1, trackWidth - 60);
  const fee = preview?.networkFeeSatoshis;
  const canConfirm =
    valid && !busy && !preview?.error && Number.isSafeInteger(fee) && fee > 0;
  return (
    <View>
      <SheetHeader onBack={onBack} />
      <View style={styles.content}>
        <View style={styles.illustration}>
          <NetworkFeeIllustration />
        </View>
        <Text style={[typography.feeHeading, styles.center]}>
          {presentation.title}
        </Text>
        <View style={styles.descriptionGap} />
        <Text style={[typography.feeDescription, styles.center]}>
          {presentation.detail}
        </Text>
        <View style={styles.sliderGap} />
        <GestureDetector gesture={sliderGesture}>
          <View
            onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
            accessibilityRole="adjustable"
            accessibilityState={{
              disabled: !available || busy,
            }}
            accessibilityLabel={t('fee.rateLabel')}
            accessibilityValue={{
              text: `${text} sat/vB`,
            }}
            accessibilityActions={[
              {
                name: 'increment',
              },
              {
                name: 'decrement',
              },
            ]}
            onAccessibilityAction={e => {
              pick(
                (Math.round(position * segments) +
                  (e.nativeEvent.actionName === 'increment' ? 1 : -1)) /
                  segments,
              );
              impactFeedback();
            }}
            style={styles.slider}
          >
            <Svg width={trackWidth} height={50}>
              <Defs>
                <LinearGradient id="feeFill">
                  <Stop stopColor={starts[tier]} />
                  <Stop offset="1" stopColor={ends[tier]} />
                </LinearGradient>
                <LinearGradient id="feeThumb" x1="0" y1="0" x2="0" y2="1">
                  <Stop stopColor="#CECFD2" />
                  <Stop offset=".75" stopColor="#F7F7F7" />
                </LinearGradient>
              </Defs>
              <Rect
                x={0}
                y={5}
                width={trackWidth}
                height={40}
                rx={20}
                fill="#FFFFFF1A"
                stroke="#FFFFFF08"
              />
              <Rect
                x={0}
                y={5}
                width={Math.min(trackWidth, center + 30)}
                height={40}
                rx={20}
                fill="url(#feeFill)"
              />
              {points.map((_, i) => (
                <Rect
                  key={i}
                  x={30 + (i / segments) * Math.max(1, trackWidth - 60) - 0.5}
                  y={20}
                  width={1}
                  height={10}
                  rx={0.5}
                  fill="#FFFFFF4D"
                />
              ))}
              <Rect
                x={center - 25}
                y={10}
                width={50}
                height={30}
                rx={15}
                fill="url(#feeThumb)"
                stroke="white"
                strokeWidth={4}
              />
            </Svg>
          </View>
        </GestureDetector>
        <View style={styles.sliderGap} />
        <FeeRateInput
          accessibilityLabel={t('fee.rateInputLabel')}
          value={text}
          editable={!busy}
          color={color}
          onChangeText={input => {
            const next = normalizeFeeInput(input);
            if (
              /^\d{0,8}$/.test(next) ||
              (next.length < text.length && /^\d{0,8}(\.\d{0,3})?$/.test(next))
            ) {
              setText(next);
              setPosition(positionFor(Number(next), points));
            }
          }}
        />
        {!!rangeError && (
          <Text accessibilityLiveRegion="polite" style={styles.validation}>
            {rangeError}
          </Text>
        )}
        {!rangeError && !!preview?.error && (
          <Text accessibilityLiveRegion="polite" style={styles.validation}>
            {preview.error}
          </Text>
        )}
        {!rangeError && !preview?.error && !!presentation.warning && valid && (
          <Text accessibilityLiveRegion="polite" style={styles.validation}>
            {presentation.warning}
          </Text>
        )}
        <View style={styles.detailsTop} />
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('fee.network')}</Text>
          <Text style={[typography.feeValue, styles.total]}>
            {fee != null
              ? `${fiat(
                  fiatPerBitcoin ? (fee / 100000000) * fiatPerBitcoin : null,
                  currency,
                )} / ${bitcoinLabel(fee)}`
              : valid && !preview?.error
              ? t('fee.calculating')
              : `— ${currency} / — ${unitName()}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, styles.rbfLabel]}>
            {t('fee.rbf')}
          </Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel={t('fee.rbfLabel')}
            accessibilityState={{
              checked: rbf,
              disabled: busy,
            }}
            disabled={busy}
            onPress={() => {
              if (!busy) {
                setRbf(current => !current);
                impactFeedback();
              }
            }}
            style={styles.unavailable}
          >
            <Text style={styles.status}>
              {rbf ? t('fee.enabled') : t('fee.disabled')}
            </Text>
          </Pressable>
        </View>
        <View style={styles.detailsBottom} />
        <SheetButton
          label={t('common.confirm')}
          disabled={!canConfirm}
          onPress={() => {
            Keyboard.dismiss();
            if (canConfirm) {
              onConfirm({
                feeRate: sending,
                rbf,
              });
            }
          }}
        />
      </View>
    </View>
  );
}
