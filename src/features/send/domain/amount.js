export const maximumSatoshis = 2100000000000000;
export const fiat = (value, currency = 'USD') =>
  value == null || !Number.isFinite(value)
    ? '—'
    : new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
        value,
      );
export const bitcoin = sats =>
  (sats / 100000000).toFixed(8).replace(/\.?0+$/, '') || '0';
// The unit amounts are shown in: the Settings "Display unit" preference,
// kept here so every label follows it without threading it through props.
let displayUnit = 'BTC';
export const setDisplayUnit = unit => {
  displayUnit = unit === 'sats' ? 'sats' : 'BTC';
};
export const unitName = () => displayUnit;
let fixedPrecision = true;
export const setFixedPrecision = value => {
  fixedPrecision = value !== false;
};
export const satoshisText = sats => Math.round(sats).toLocaleString('en-US');
// For display only; amount fields keep bitcoin(), which parseAmount reads.
export const bitcoinText = sats => {
  const value = Math.abs(Math.round(sats));
  const fraction = String(value % 100000000).padStart(8, '0');
  return `${sats < 0 ? '-' : ''}${Math.floor(value / 100000000).toLocaleString(
    'en-US',
  )}.${fixedPrecision ? fraction : fraction.replace(/0{1,6}$/, '')}`;
};
export const bitcoinLabel = sats =>
  displayUnit === 'sats'
    ? `${satoshisText(sats)} sats`
    : `${bitcoinText(sats)} BTC`;
export const rateLabel = rate =>
  Number(rate)
    .toFixed(3)
    .replace(/\.?0+$/, '');
export const normalizeAmountInput = text =>
  text
    .trim()
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 0x6f0))
    .replace(/[٫,]/g, '.');
export function parseAmount(text, fiatMode, fiatPerBitcoin) {
  if (!/^\d*(?:\.\d*)?$/.test(text)) {
    return 0;
  }
  if (fiatMode) {
    if (!Number.isFinite(fiatPerBitcoin) || fiatPerBitcoin <= 0) {
      return 0;
    }

    const ratio = value => {
      const [decimal, power = '0'] = String(value).toLowerCase().split('e');
      const [whole, fraction = ''] = decimal.split('.');
      const scale = fraction.length - Number(power);
      const numerator = BigInt((whole || '0') + fraction);
      return scale >= 0
        ? [numerator, 10n ** BigInt(scale)]
        : [numerator * 10n ** BigInt(-scale), 1n];
    };
    const [amount, amountScale] = ratio(text || '0'),
      [rate, rateScale] = ratio(fiatPerBitcoin);
    const denominator = amountScale * rate;
    const sats = Number(
      (amount * rateScale * 100000000n + denominator / 2n) / denominator,
    );
    return Number.isSafeInteger(sats) && sats <= maximumSatoshis ? sats : 0;
  }
  const [whole = '', fraction = ''] = text.split('.');
  return (
    Number(whole || 0) * 100000000 + Number(fraction.padEnd(8, '0').slice(0, 8))
  );
}

export function currencySymbol(currency) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  if (typeof formatter.formatToParts === 'function') {
    return (
      formatter.formatToParts(0).find(part => part.type === 'currency')
        ?.value ?? currency
    );
  }

  return formatter.format(0).replace(/0/g, '').trim() || currency;
}

export const currencyDigits = currency =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).resolvedOptions().maximumFractionDigits;
