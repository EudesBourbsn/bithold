import { t } from '../../i18n/core.js';
import { fetchJSON } from '../domain/paymentPlan.js';

export const FEE_KEYS = [
  'minimumFee',
  'economyFee',
  'hourFee',
  'halfHourFee',
  'fastestFee',
];
export function validFeeRate(value) {
  return Number.isFinite(value) && value >= 1 && value <= 1000;
}
export function parseFeeRate(text) {
  return typeof text === 'string' &&
    /^\d+(?:\.\d{0,3})?$/.test(text) &&
    validFeeRate(Number(text))
    ? Number(text)
    : null;
}
export function normalizeFeeInput(text) {
  return text
    .replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 1776))
    .replace(/[,٫]/g, '.');
}
export function freshFees(fees, now = Date.now()) {
  return (
    !!fees &&
    FEE_KEYS.every(
      (key, i) =>
        validFeeRate(fees[key]) && (!i || fees[key] >= fees[FEE_KEYS[i - 1]]),
    ) &&
    Number.isFinite(fees.updated) &&
    fees.updated <= now + 60000 &&
    now - fees.updated < 30 * 60000
  );
}

const MIN_SEND_RATE = 2;
const CONFIG_MIN_FEE_RATE = 10;
export function defaultFeeRate(fees) {
  return freshFees(fees)
    ? Math.min(1000, Math.max(MIN_SEND_RATE, fees.fastestFee))
    : MIN_SEND_RATE;
}
export function feeRange(fees) {
  const recommended = fees.fastestFee;
  const nextBlock = fees.nextBlockMinimumFee ?? fees.hourFee;
  return {
    min: Math.min(
      Math.max(fees.minimumFee, CONFIG_MIN_FEE_RATE),
      Math.min(fees.hourFee, nextBlock),
    ),
    recommended,

    max: Math.round(Math.min(1000, recommended * 3) * 1000) / 1000,
  };
}

export function feeSnapPoints({ min, recommended, max }) {
  const rates = (
    min !== recommended
      ? [
          min,
          (min + recommended) / 2,
          recommended,
          (recommended + max) / 2,
          max,
        ]
      : [min, recommended + (max - recommended) / 2, max]
  ).map(rate => Math.round(rate * 1000) / 1000);

  return [...new Set(rates)];
}
export function sendFeeRate(rate, fees) {
  return freshFees(fees) && rate === feeRange(fees).recommended
    ? defaultFeeRate(fees)
    : rate;
}
const TIERS = ['veryLow', 'low', 'recommended', 'priority', 'top'];

export function feePresentation(rate, fees) {
  if (!freshFees(fees)) {
    return {
      tier: 2,
      title: t('fee.custom'),
      detail: t('fee.estimateUnavailable'),
    };
  }
  if (!validFeeRate(rate)) {
    return {
      tier: 2,
      title: t('fee.network'),
      detail: t('fee.enterValid'),
    };
  }
  const { min, recommended, max } = feeRange(fees);
  const low = recommended - min,
    high = max - recommended;
  const tier =
    high <= 0 && rate >= recommended
      ? 2
      : rate < min + low / 4
      ? 0
      : rate < recommended - low / 4
      ? 1
      : rate < recommended + high / 4
      ? 2
      : rate < max - high / 4
      ? 3
      : 4;
  return {
    tier,
    title: t(`fee.tier.${TIERS[tier]}`),
    detail: t('fee.speed', { speed: t(`fee.speedName.${TIERS[tier]}`) }),
    warning: tier === 0 ? t('fee.lowWarning') : null,
  };
}
export function decodeFees(source, data, now = Date.now()) {
  const values =
    source === 'blockstream'
      ? [1008, 144, 6, 3, 1].map(target => data?.[target])
      : source === 'mempool'
      ? FEE_KEYS.map(key => data?.recommended?.[key])
      : [];
  if (
    values.length !== 5 ||
    values.some(v => !Number.isFinite(v) || v <= 0 || v > 1000)
  ) {
    throw new Error(t('error.fees.invalidFeeRecommendations'));
  }
  if (values.some((v, i) => i > 0 && v < values[i - 1])) {
    throw new Error(t('error.fees.inconsistentFeeRecommendations'));
  }

  const rounded = values.map(v =>
    Math.max(1, Math.ceil(Math.round(v * 1e6) / 1e3) / 1000),
  );
  if (rounded.some((v, i) => i > 0 && v < rounded[i - 1])) {
    throw new Error(t('error.fees.inconsistentFeeRecommendations'));
  }

  const nextBlock =
    source === 'mempool' ? data?.blocks?.[0]?.feeRange?.[0] : data?.[1];
  if (!Number.isFinite(nextBlock) || nextBlock < 0 || nextBlock > 1000) {
    throw new Error(t('error.fees.invalidFeeRecommendations'));
  }
  return {
    ...Object.fromEntries(FEE_KEYS.map((key, i) => [key, rounded[i]])),
    nextBlockMinimumFee: Math.max(1, Math.ceil(nextBlock)),
    rawRates: Object.fromEntries(FEE_KEYS.map((key, i) => [key, values[i]])),
    source,
    updated: now,
  };
}

const FEE_APIS = {
  testnet: 'https://mempool.space/testnet4/api',
  testnet3: 'https://mempool.space/testnet/api',
  signet: 'https://mempool.space/signet/api',
};
export async function fetchFees(fetcher = fetch, network = 'Mainnet', variant) {
  // The minimum relay rate: regtest always, and a test network whose fee
  // service cannot be reached (its coins have no value).
  const minimum = () =>
    decodeFees('mempool', {
      recommended: Object.fromEntries(FEE_KEYS.map(key => [key, 1])),
      blocks: [{ feeRange: [1] }],
    });
  if (network === 'regtest') {
    return minimum();
  }
  if (network !== 'Mainnet') {
    try {
      return await testNetworkFees(fetcher, network, variant);
    } catch {
      return minimum();
    }
  }
  try {
    const [recommended, blocks] = await Promise.all([
      fetchJSON('https://mempool.space/api/v1/fees/recommended', fetcher),
      fetchJSON('https://mempool.space/api/v1/fees/mempool-blocks', fetcher),
    ]);
    return decodeFees('mempool', { recommended, blocks });
  } catch {
    return decodeFees(
      'blockstream',
      await fetchJSON('https://blockstream.info/api/fee-estimates', fetcher),
    );
  }
}
async function testNetworkFees(fetcher, network, variant) {
  const base =
    FEE_APIS[
      network === 'testnet' && variant === 'testnet3' ? 'testnet3' : network
    ];
  const [recommended, blocks] = await Promise.all([
    fetchJSON(`${base}/v1/fees/recommended`, fetcher),
    fetchJSON(`${base}/v1/fees/mempool-blocks`, fetcher),
  ]);
  // An empty test mempool has no projected blocks: the next block then
  // takes the minimum rate.
  return decodeFees('mempool', {
    recommended,
    blocks:
      Array.isArray(blocks) && blocks.length ? blocks : [{ feeRange: [1] }],
  });
}
