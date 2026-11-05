import { t } from '../../i18n/core.js';
import { CURRENCY_CODES } from '../config/currencies.js';
import { fetchJSON } from '../domain/paymentPlan.js';
import { validRate } from './rates.js';

const GECKO = new Set(
  'USD AED ARS AUD BDT BHD BRL CAD CHF CLP CNY CZK DKK EUR GBP HKD HUF IDR ILS INR JPY KRW KWD LKR MXN MYR NGN NOK NZD PHP PKR PLN RUB SAR SEK SGD THB TRY TWD UAH VND ZAR'.split(
    ' ',
  ),
);
const HOUR = 3600000,
  DAY = 86400000;

export const CHART_RANGES = ['1D', '1W', '1M', '1Y', '5Y'];
const RANGES = {
  '1D': {
    coinbase: 'day',
    gecko: 1,
    span: DAY,
    minSpan: 23 * HOUR,
    maxAge: 3 * HOUR,
  },
  '1W': {
    coinbase: 'week',
    gecko: 7,
    span: 7 * DAY,
    minSpan: 6.5 * DAY,
    maxAge: 3 * HOUR,
  },
  '1M': {
    coinbase: 'month',
    gecko: 30,
    span: 30 * DAY,
    minSpan: 28 * DAY,

    maxAge: 24 * HOUR,
  },
  '1Y': {
    coinbase: 'year',
    gecko: 365,
    span: 365 * DAY,
    minSpan: 340 * DAY,
    maxAge: 36 * HOUR,
  },
  '5Y': {
    coinbase: 'all',
    gecko: null,
    span: 5 * 365 * DAY,
    minSpan: 1700 * DAY,
    maxAge: 36 * HOUR,
  },
};

const YADIO_RULE = {
  span: 7 * DAY,
  minSpan: 5 * DAY,
  maxAge: 36 * HOUR,
  minPoints: 2,
};
export const chartKey = (currency, range) =>
  range === '1D' ? currency : `${currency}:${range}`;
function normalize(points, now, rule) {
  const unique = new Map();
  for (const { time, price } of points) {
    if (!Number.isFinite(time) || time <= 0 || !validRate(price)) {
      throw new Error(t('error.chart.invalidHistoricalPrice'));
    }

    if (time > now + 60000) {
      continue;
    }
    unique.set(time, { time, price: Number(price) });
  }
  const ordered = [...unique.values()].sort((a, b) => a.time - b.time);
  const latest = ordered.at(-1)?.time;
  if (!latest || now - latest > rule.maxAge) {
    throw new Error(t('error.chart.historicalPricesAreStale'));
  }
  const window = ordered.filter(p => p.time >= latest - rule.span);
  if (
    window.length < (rule.minPoints ?? 24) ||
    window.at(-1).time - window[0].time < rule.minSpan
  ) {
    throw new Error(t('error.chart.notEnoughHistoricalPrices'));
  }
  return window;
}
export function decodeHistory(
  source,
  currency,
  data,
  now = Date.now(),
  range = '1D',
) {
  if (!RANGES[range]) {
    throw new Error(t('error.chart.unsupportedChartRange'));
  }
  let points,
    period = range === '1D' ? '24h' : range,
    rule = RANGES[range];
  if (source === 'coinbase') {
    if (
      data?.data?.base !== 'BTC' ||
      data.data.currency !== currency ||
      !Array.isArray(data.data.prices)
    ) {
      throw new Error(t('error.chart.incorrectHistoryCurrency'));
    }
    points = data.data.prices.map(p => ({
      time: Number(p.time) * 1000,
      price: p.price,
    }));
  } else if (source === 'coingecko') {
    if (!Array.isArray(data?.prices)) {
      throw new Error(t('error.chart.invalidHistoricalResponse'));
    }
    points = data.prices.map(p => ({ time: p[0], price: p[1] }));
  } else if (source === 'yadio') {
    if (!Array.isArray(data)) {
      throw new Error(t('error.chart.invalidHistoricalResponse'));
    }
    period = '7d avg';
    rule = YADIO_RULE;
    points = data.map(p => {
      const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(p.date ?? '');
      if (!match) {
        throw new Error(t('error.chart.invalidHistoryDate'));
      }
      const time = Date.UTC(
        Number(match[3]),
        Number(match[1]) - 1,
        Number(match[2]),
      );
      const date = new Date(time);
      if (
        date.getUTCMonth() + 1 !== Number(match[1]) ||
        date.getUTCDate() !== Number(match[2])
      ) {
        throw new Error(t('error.chart.invalidHistoryDate'));
      }
      return { time, price: p.avg24h };
    });
  } else {
    throw new Error(t('error.chart.unknownHistorySource'));
  }
  return {
    currency,
    source,
    period,
    range,
    points: normalize(points, now, rule),
    updated: now,
  };
}

export function chartState(chart, range, now = Date.now()) {
  if (!chart?.points?.length || (range === '1D' && chart.source === 'yadio')) {
    return { usable: false, stale: false };
  }
  const rule = chart.source === 'yadio' ? YADIO_RULE : RANGES[range];
  const age = now - chart.points.at(-1).time;
  return { usable: true, stale: !rule || age > rule.maxAge };
}
export class ChartClient {
  constructor(fetcher = fetch) {
    this.fetcher = fetcher;
    this.cooldowns = new Map();
    this.errors = {};
  }

  retry(currency, range) {
    for (const key of [...this.cooldowns.keys()]) {
      if (key.endsWith(`:${currency}:${range}`)) {
        this.cooldowns.delete(key);
      }
    }
  }
  async get(currency, range = '1D') {
    if (!CURRENCY_CODES.includes(currency)) {
      throw new Error(t('error.chart.unsupportedHistoryCurrency'));
    }
    const rule = RANGES[range];
    if (!rule) {
      throw new Error(t('error.chart.unsupportedChartRange'));
    }
    const sources = [
      [
        'coinbase',
        `https://api.coinbase.com/v2/prices/BTC-${currency}/historic?period=${rule.coinbase}`,
      ],
    ];
    if (GECKO.has(currency) && rule.gecko) {
      sources.push([
        'coingecko',
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency.toLowerCase()}&days=${
          rule.gecko
        }`,
      ]);
    }
    if (range === '1W') {
      sources.push(['yadio', `https://api.yadio.io/hist/7/${currency}`]);
    }
    for (const [source, url] of sources) {
      const key = `${source}:${currency}:${range}`;
      if ((this.cooldowns.get(key) ?? 0) > Date.now()) {
        continue;
      }
      try {
        const history = decodeHistory(
          source,
          currency,
          await fetchJSON(url, this.fetcher),
          Date.now(),
          range,
        );
        this.cooldowns.delete(key);
        delete this.errors[key];
        return history;
      } catch (error) {
        this.cooldowns.set(key, Date.now() + 60000);
        this.errors[key] = error.message;
      }
    }
    throw new Error(t('error.chart.historyUnavailable', { currency }));
  }
}
