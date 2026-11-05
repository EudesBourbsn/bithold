import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useT } from '../../../i18n/index';
import { selectionFeedback } from '../../../services/feedback';
import { chartKey, chartState } from '../../../wallet/network/charts';
import { bitcoinAsset } from '../../activity/components/TransactionHero';
import { currencyDigits } from '../../send/domain/amount';
import { fonts } from '../../../theme/fonts';

const MARGIN = 16;
const PADDING = 16;
const CARD_HEIGHT = 168; // the band's bottom + 24, where Buy/Sell starts
const ICON = 36;
const STROKE = 2;
// The line's stroke centres span y 80–144 of the card (the day's high to its
// low).
const BAND_TOP = 80;
const BAND_BOTTOM = 144;
const HOUR = 3600000;
const tone = {
  surface: '#303143',
  border: 'rgb(73, 73, 104)',
  text: '#FFFFFF',
  secondary: 'rgba(255, 255, 255, 0.64)',
  line: '#2F7EC3',
};

function hourly(points) {
  if (points.length < 3) {
    return points;
  }
  const t0 = points[0].time;
  const result = [points[0]];
  let bucket = 0;
  for (let i = 1; i < points.length; i++) {
    const current = Math.floor((points[i].time - t0) / HOUR);
    if (current !== bucket && result.at(-1) !== points[i - 1]) {
      result.push(points[i - 1]);
    }
    bucket = current;
  }
  if (result.at(-1) !== points.at(-1)) {
    result.push(points.at(-1));
  }
  return result;
}

// d3's curveMonotoneX (Fritsch–Carlson): a smooth cubic through every point
// that never overshoots it.
function monotonePath(xy) {
  const n = xy.length;
  if (n < 2) {
    return null;
  }
  if (n === 2) {
    return `M${xy[0][0]},${xy[0][1]}L${xy[1][0]},${xy[1][1]}`;
  }
  const sign = value => (value < 0 ? -1 : 1);
  const slope = i => (xy[i + 1][1] - xy[i][1]) / (xy[i + 1][0] - xy[i][0] || 1);
  const tangents = new Array(n);
  for (let i = 1; i < n - 1; i++) {
    const h0 = xy[i][0] - xy[i - 1][0],
      h1 = xy[i + 1][0] - xy[i][0];
    const s0 = slope(i - 1),
      s1 = slope(i);
    const p = (s0 * h1 + s1 * h0) / (h0 + h1 || 1);
    tangents[i] =
      (sign(s0) + sign(s1)) *
        Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }
  tangents[0] = (3 * slope(0) - tangents[1]) / 2;
  tangents[n - 1] = (3 * slope(n - 2) - tangents[n - 2]) / 2;
  let path = `M${xy[0][0]},${xy[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = xy[i],
      [x1, y1] = xy[i + 1];
    const dx = (x1 - x0) / 3;
    path += `C${x0 + dx},${y0 + dx * tangents[i]},${x1 - dx},${
      y1 - dx * tangents[i + 1]
    },${x1},${y1}`;
  }
  return path;
}

function linePath(points, width) {
  if (points.length < 2) {
    return null;
  }
  const t0 = points[0].time,
    t1 = points.at(-1).time;
  let low = Infinity,
    high = -Infinity;
  for (const p of points) {
    low = Math.min(low, p.price);
    high = Math.max(high, p.price);
  }
  const band = BAND_BOTTOM - BAND_TOP;
  return monotonePath(
    points.map(p => [
      STROKE / 2 + ((p.time - t0) / (t1 - t0 || 1)) * width,
      STROKE / 2 +
        (high === low ? band / 2 : ((high - p.price) / (high - low)) * band),
    ]),
  );
}

export function BitcoinPriceCard() {
  const t = useT();
  const { width } = useWindowDimensions();
  const { market, quote, preferences, engine } = useWallets();
  const currency = preferences.currency;
  const [request, setRequest] = useState({ attempt: 0, settled: null });
  const key = chartKey(currency, '1D');
  const stored = market.charts?.[key];
  const { usable, stale } = chartState(stored, '1D');
  const chart = usable ? stored : null;

  const loading = request.settled !== `${key}:${request.attempt}`;
  useEffect(() => {
    let active = true;
    engine.chartRange = '1D';
    const settled = `${key}:${request.attempt}`;
    engine
      .refreshChart(currency, '1D', { retry: request.attempt > 0 })
      .catch(() => null)
      .finally(() => {
        if (active) {
          setRequest(previous =>
            previous.attempt === request.attempt
              ? { ...previous, settled }
              : previous,
          );
        }
      });
    return () => {
      active = false;
    };
  }, [engine, currency, key, request.attempt]);

  const cardWidth = width - MARGIN * 2;
  const points = useMemo(() => hourly(chart?.points ?? []), [chart]);
  const path = useMemo(() => linePath(points, cardWidth), [points, cardWidth]);
  const digits = currencyDigits(currency);
  const price = quote ?? points.at(-1)?.price ?? null;
  const priceText =
    price != null
      ? price.toLocaleString('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        })
      : null;
  const first = points[0]?.price;
  const percent =
    price != null && first && !stale ? ((price - first) / first) * 100 : null;
  // "+3.24%": signed, two decimals, no sign when it rounds to zero.
  const rounded = percent != null ? Math.round(percent * 100) / 100 : null;
  const changeText =
    rounded != null
      ? t('chart.today', {
          change: `${rounded > 0 ? '+' : rounded < 0 ? '-' : ''}${Math.abs(
            rounded,
          ).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}%`,
        })
      : null;
  const showRetry = !path && !loading;
  const retry = () => {
    selectionFeedback();
    setRequest(previous => ({ attempt: previous.attempt + 1, settled: null }));
  };
  const label = [
    t('chart.bitcoinPrice'),
    priceText && ` ${priceText}`,
    changeText && `, ${changeText}`,
    showRetry && `, ${t('chart.noData')}`,
  ]
    .filter(Boolean)
    .join('');

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={label}
      accessibilityActions={showRetry ? [{ name: 'activate' }] : undefined}
      onAccessibilityAction={showRetry ? retry : undefined}
      style={styles.card}
    >
      <View style={styles.header}>
        <Image source={bitcoinAsset} style={styles.icon} />
        <View style={styles.figures}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            minimumFontSize={7}
            style={styles.price}
          >
            {priceText ?? ' '}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.change}
          >
            {changeText ?? ' '}
          </Text>
        </View>
      </View>
      {path ? (
        <Svg
          pointerEvents="none"
          width={cardWidth + STROKE}
          height={BAND_BOTTOM - BAND_TOP + STROKE}
          style={styles.line}
        >
          <Path
            d={path}
            fill="none"
            stroke={tone.line}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        showRetry && (
          <Pressable
            accessibilityRole="button"
            onPress={retry}
            style={styles.noData}
          >
            <Text allowFontScaling={false} style={styles.noDataText}>
              {t('chart.noData')}
            </Text>
          </Pressable>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // app-surface, radius-2xl, padding 16; the line runs from edge to edge.
  card: {
    marginHorizontal: MARGIN,
    height: CARD_HEIGHT,
    padding: PADDING,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: tone.border,
    backgroundColor: tone.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: { width: ICON, height: ICON },
  figures: {
    flexShrink: 1,
    marginTop: -1,
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  price: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: tone.text,
  },
  change: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: tone.secondary,
  },
  line: {
    position: 'absolute',
    left: -STROKE / 2,
    top: BAND_TOP - STROKE / 2,
  },
  noData: {
    position: 'absolute',
    left: PADDING,
    right: PADDING,
    top: BAND_TOP,
    height: BAND_BOTTOM - BAND_TOP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    ...fonts.regular,
    fontSize: 14,
    color: tone.secondary,
  },
});
