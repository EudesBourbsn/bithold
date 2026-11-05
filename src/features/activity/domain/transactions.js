import { dateLocale, t } from '../../../i18n/core.js';
import {
  explorerAddressURL,
  explorerTransactionURL,
} from '../../../wallet/config/blockExplorers.js';
import { btc, hexToBytes, networkFor } from '../../../wallet/domain/keys.js';
import { bitcoinLabel, fiat } from '../../send/domain/amount.js';

export const hasQuote = quote => Number.isFinite(quote) && quote > 0;

export const truncateAddress = (value, prefix = 4, suffix = 4) =>
  typeof value !== 'string'
    ? ''
    : value.length > prefix + suffix + 3
    ? `${value.slice(0, prefix)}...${value.slice(-suffix)}`
    : value;

export function activityAmount(sats) {
  if (!Number.isFinite(sats) || sats === 0) {
    return null;
  }
  return bitcoinLabel(Math.abs(sats));
}

export function truncatedValue(sats, quote, currency) {
  return hasQuote(quote)
    ? fiat(
        Math.floor((Math.abs(sats) / 1e8) * quote * 100 + 1e-9) / 100,
        currency,
      )
    : bitcoinLabel(Math.abs(sats));
}

export function formatTime(timestamp) {
  return new Date(timestamp)
    .toLocaleTimeString(dateLocale(), { hour: 'numeric', minute: '2-digit' })
    .replace(/\s/g, ' ');
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString(dateLocale(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const time = date
    .toLocaleTimeString(dateLocale(), { hour: 'numeric', minute: '2-digit' })
    .replace(/\s/g, ' ');
  return `${day}, ${time}`;
}

export function fromNow(timestamp, now = Date.now()) {
  const past = timestamp <= now;
  const seconds = Math.round(Math.abs(now - timestamp) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.436875);
  const years = Math.round(months / 12);
  const text =
    seconds < 45
      ? t('time.seconds')
      : minutes <= 1
      ? t('time.minute')
      : minutes < 45
      ? t('time.minutes', { count: minutes })
      : hours <= 1
      ? t('time.hour')
      : hours < 22
      ? t('time.hours', { count: hours })
      : days <= 1
      ? t('time.day')
      : days < 26
      ? t('time.days', { count: days })
      : months <= 1
      ? t('time.month')
      : months < 11
      ? t('time.months', { count: months })
      : years <= 1
      ? t('time.year')
      : t('time.years', { count: years });
  const relative = t(past ? 'time.ago' : 'time.in', { time: text });
  return relative[0].toUpperCase() + relative.slice(1);
}
export const currentValue = (sats, quote, currency) =>
  hasQuote(quote) ? fiat((sats / 1e8) * quote, currency) : bitcoinLabel(sats);

const EXPLORER_PATHS = {
  Mainnet: '',
  testnet: '/testnet4',
  testnet3: '/testnet',
  signet: '/signet',
};
// testnet means testnet4 unless the server in use is a testnet3 one.
const explorerNetwork = (network, variant) =>
  network === 'testnet' && variant === 'testnet3' ? 'testnet3' : network;
export function transactionURL(id, network = 'Mainnet', variant, explorer) {
  const paths = EXPLORER_PATHS;
  network = explorerNetwork(network, variant);
  return /^[a-f0-9]{64}$/i.test(id) && Object.hasOwn(paths, network)
    ? explorerTransactionURL(
        explorer,
        network === 'Mainnet',
        paths[network],
        id,
      )
    : null;
}

export function accelerateURL(id) {
  return /^[a-f0-9]{64}$/i.test(id)
    ? `https://mempool.space/tx/${id}#accelerate`
    : null;
}

export function addressURL(address, network = 'Mainnet', variant, explorer) {
  const paths = EXPLORER_PATHS;
  network = explorerNetwork(network, variant);
  return Object.hasOwn(paths, network)
    ? explorerAddressURL(
        explorer,
        network === 'Mainnet',
        paths[network],
        address,
      )
    : null;
}
export function transactionAddresses(tx, wallet) {
  const known = new Map(
    (wallet?.snapshot?.addresses ?? []).map(row => [row.script, row.address]),
  );
  const decode = rows => [
    ...new Set(
      rows
        .map(row => {
          if (known.get(row.script)) {
            return known.get(row.script);
          }
          try {
            return btc
              .Address(networkFor(wallet?.network))
              .encode(btc.OutScript.decode(hexToBytes(row.script)));
          } catch {
            return null;
          }
        })
        .filter(Boolean),
    ),
  ];
  const inputs = tx.inputs ?? [],
    outputs = tx.outputs ?? [];

  const from = decode(
    tx.direction === 'received'
      ? inputs
      : inputs.filter(row => known.has(row.script)),
  );
  const to = decode(
    outputs.filter(row =>
      tx.direction === 'sent' ? !known.has(row.script) : known.has(row.script),
    ),
  );
  return {
    from,
    to,
    selfAmount: outputs
      .filter(row => known.has(row.script))
      .reduce((sum, row) => sum + row.value, 0),
  };
}

export function activityGroups(transactions, now = new Date()) {
  const day = timestamp => {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };
  const today = day(now.getTime());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const groups = new Map();
  const sorted = [...transactions].sort(
    (a, b) =>
      Number(!b.confirmations) - Number(!a.confirmations) ||
      b.timestamp - a.timestamp,
  );
  for (const tx of sorted) {
    const timestamp = day(tx.timestamp);
    const key = !tx.confirmations
      ? 'pending'
      : Number.isFinite(timestamp)
      ? String(timestamp)
      : 'unknown';
    if (!groups.has(key)) {
      const date = new Date(timestamp);
      const label =
        key === 'pending'
          ? t('activity.pending')
          : key === 'unknown'
          ? t('activity.dateUnavailable')
          : timestamp === today
          ? t('activity.today')
          : timestamp === yesterday.getTime()
          ? t('activity.yesterday')
          : date.toLocaleDateString(dateLocale(), {
              month: 'short',
              day: 'numeric',
              ...(date.getFullYear() !== now.getFullYear()
                ? { year: 'numeric' }
                : {}),
            });
      groups.set(key, { key, label, transactions: [] });
    }
    groups.get(key).transactions.push(tx);
  }
  return [...groups.values()];
}
