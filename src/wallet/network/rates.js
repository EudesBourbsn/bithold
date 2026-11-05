import { t } from '../../i18n/core.js';
import { CURRENCY_CODES } from '../config/currencies.js';
import { fetchJSON } from '../domain/paymentPlan.js';

const allowed = new Set(CURRENCY_CODES);
const KRAKEN = {
  USD: 'XXBTZUSD',
  EUR: 'XXBTZEUR',
  GBP: 'XXBTZGBP',
  CAD: 'XXBTZCAD',
  JPY: 'XXBTZJPY',
  AUD: 'XBTAUD',
  CHF: 'XBTCHF',
};
const GECKO = new Set(
  'USD AED ARS AUD BDT BHD BRL CAD CHF CLP CNY CZK DKK EUR GBP HKD HUF IDR ILS INR JPY KRW KWD LKR MXN MYR NGN NOK NZD PHP PKR PLN RUB SAR SEK SGD THB TRY TWD UAH VND ZAR'.split(
    ' ',
  ),
);
export const RATE_URLS = {
  coinbase: 'https://api.coinbase.com/v2/exchange-rates?currency=BTC',
  yadio: 'https://api.yadio.io/exrates/BTC',
};
export function validRate(value) {
  if (
    typeof value !== 'number' &&
    (typeof value !== 'string' ||
      !/^\d+(?:\.\d+)?$/.test(value) ||
      value.length > 128)
  ) {
    return false;
  }
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 && rate < 1e18;
}
export function decodeBatch(source, data, now = Date.now()) {
  let rates,
    updated = now;
  if (source === 'coinbase') {
    if (data?.data?.currency !== 'BTC') {
      throw new Error(t('error.rates.incorrectRateBaseCurrency'));
    }
    rates = data.data.rates;
  } else if (source === 'yadio') {
    if (data?.base !== 'BTC') {
      throw new Error(t('error.rates.incorrectRateBaseCurrency'));
    }
    rates = data.BTC;
    if (
      !Number.isFinite(data.timestamp) ||
      data.timestamp > now + 60000 ||
      now - data.timestamp > 86400000
    ) {
      throw new Error(t('error.rates.invalidStaleRateTimestamp'));
    }
    updated = data.timestamp;
  } else {
    throw new Error(t('error.rates.unknownRateProvider'));
  }
  if (!rates || typeof rates !== 'object' || Array.isArray(rates)) {
    throw new Error(t('error.rates.invalidRateResponse'));
  }
  const quotes = {},
    meta = {};
  for (const code of CURRENCY_CODES) {
    if (validRate(rates[code])) {
      quotes[code] = Number(rates[code]);
      meta[code] = { source, updated };
    }
  }
  if (!Object.keys(quotes).length) {
    throw new Error(t('error.rates.noSupportedPricesResponse'));
  }
  return { quotes, meta };
}

export class RateClient {
  constructor(fetcher = fetch) {
    this.fetcher = fetcher;
    this.cooldowns = new Map();
    this.errors = {};
  }
  async request(key, url, decode) {
    if ((this.cooldowns.get(key) ?? 0) > Date.now()) {
      throw new Error(t('error.rates.providerCoolingDownFailure'));
    }
    try {
      const value = decode(await fetchJSON(url, this.fetcher));
      this.cooldowns.delete(key);
      delete this.errors[key];
      return value;
    } catch (error) {
      this.cooldowns.set(key, Date.now() + 30000);
      this.errors[key] = error.message;
      throw error;
    }
  }
  async batch(onUpdate = () => {}) {
    const quotes = {},
      meta = {};
    await Promise.allSettled(
      Object.entries(RATE_URLS).map(async ([source, url]) => {
        const batch = await this.request(source, url, data =>
          decodeBatch(source, data),
        );
        for (const [code, price] of Object.entries(batch.quotes)) {
          const preferred = ['IRR', 'IRT'].includes(code)
            ? 'yadio'
            : 'coinbase';
          if (!meta[code] || source === preferred) {
            quotes[code] = price;
            meta[code] = batch.meta[code];
          }
        }
        await onUpdate({ quotes: { ...quotes }, meta: { ...meta } });
      }),
    );
    return { quotes, meta };
  }
  async single(code) {
    if (!allowed.has(code)) {
      throw new Error(t('error.rates.unsupportedCurrency'));
    }
    const candidates = [];
    if (KRAKEN[code]) {
      candidates.push([
        'kraken',
        `https://api.kraken.com/0/public/Ticker?pair=${KRAKEN[code]}`,
        data => {
          if (data?.error?.length) {
            throw new Error(t('error.rates.krakenReturnedError'));
          }
          return data?.result?.[KRAKEN[code]]?.c?.[0];
        },
      ]);
    }
    candidates.push([
      'coinbase-spot',
      `https://api.coinbase.com/v2/prices/BTC-${code}/spot`,
      data => {
        if (data?.data?.base !== 'BTC' || data.data.currency !== code) {
          throw new Error(t('error.rates.incorrectPriceCurrency'));
        }
        return data.data.amount;
      },
    ]);
    candidates.push([
      'yadio-convert',
      `https://api.yadio.io/convert/1/BTC/${code}`,
      data => {
        if (
          data?.request?.from !== 'BTC' ||
          data.request.to !== code ||
          Number(data.request.amount) !== 1 ||
          !Number.isFinite(data.timestamp) ||
          Date.now() - data.timestamp > 86400000 ||
          data.timestamp > Date.now() + 60000
        ) {
          throw new Error(t('error.rates.invalidConversionResponse'));
        }
        return data.rate;
      },
    ]);
    if (['USD', 'EUR', 'GBP'].includes(code)) {
      candidates.push([
        'bitstamp',
        `https://www.bitstamp.net/api/v2/ticker/btc${code.toLowerCase()}`,
        data => data?.last,
      ]);
    }
    if (GECKO.has(code)) {
      candidates.push([
        'coingecko',
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${code.toLowerCase()}`,
        data => data?.bitcoin?.[code.toLowerCase()],
      ]);
    }
    for (const [source, url, read] of candidates) {
      try {
        const quote = await this.request(`${source}:${code}`, url, data => {
          const value = read(data);
          if (!validRate(value)) {
            throw new Error(t('error.rates.invalidBitcoinPrice'));
          }
          return {
            price: Number(value),
            updated: source === 'yadio-convert' ? data.timestamp : Date.now(),
          };
        });
        return {
          quotes: { [code]: quote.price },
          meta: { [code]: { source, updated: quote.updated } },
        };
      } catch {}
    }
    throw new Error(t('error.rates.noProvider', { currency: code }));
  }
}
