import { sha256 } from '@noble/hashes/sha2.js';
import { btc, networkFor } from '../../../wallet/domain/keys.js';

const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export function validBitcoinAddress(input, network = 'Mainnet') {
  const address = input.trim();
  if (!address || address.length > 90) {
    return false;
  }
  // Test networks: the wallet's network decides (tb1/bcrt1, m/n/2).
  if (network !== 'Mainnet') {
    try {
      btc.Address(networkFor(network)).decode(address);
      return true;
    } catch {
      return false;
    }
  }
  if (address.toLowerCase().startsWith('bc1')) {
    return validSegwit(address);
  }
  if (address.length < 26 || address.length > 35) {
    return false;
  }
  let number = 0n;
  for (const char of address) {
    const digit = base58.indexOf(char);
    if (digit < 0) {
      return false;
    }
    number = number * 58n + BigInt(digit);
  }
  const bytes = [];
  while (number > 0n) {
    bytes.unshift(Number(number & 255n));
    number >>= 8n;
  }
  for (const char of address) {
    if (char !== '1') {
      break;
    }
    bytes.unshift(0);
  }
  if (bytes.length !== 25 || (bytes[0] !== 0 && bytes[0] !== 5)) {
    return false;
  }
  const check = sha256(sha256(Uint8Array.from(bytes.slice(0, 21))));
  return check.slice(0, 4).every((value, index) => value === bytes[21 + index]);
}
function validSegwit(address) {
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) {
    return false;
  }
  const normalized = address.toLowerCase(),
    alphabet = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l',
    data = [];
  for (const char of normalized.slice(3)) {
    const value = alphabet.indexOf(char);
    if (value < 0) {
      return false;
    }
    data.push(value);
  }
  if (data.length < 7) {
    return false;
  }
  const hrp = [
    ...Array.from('bc', c => c.charCodeAt(0) >> 5),
    0,
    ...Array.from('bc', c => c.charCodeAt(0) & 31),
  ];
  const generators = [
    0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3,
  ];
  let checksum = 1;
  for (const value of [...hrp, ...data]) {
    const top = checksum >>> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i++) {
      if ((top >>> i) & 1) {
        checksum ^= generators[i];
      }
    }
    checksum >>>= 0;
  }
  const version = data[0];
  if (version > 16 || checksum !== (version === 0 ? 1 : 0x2bc830a3)) {
    return false;
  }
  let accumulator = 0,
    bits = 0,
    programLength = 0;
  for (const value of data.slice(1, -6)) {
    accumulator = ((accumulator << 5) | value) & 0xfff;
    bits += 5;
    while (bits >= 8) {
      bits -= 8;
      programLength++;
    }
  }
  return (
    bits < 5 &&
    ((accumulator << (8 - bits)) & 255) === 0 &&
    programLength >= 2 &&
    programLength <= 40 &&
    (version !== 0 || programLength === 20 || programLength === 32)
  );
}
export function addressFromQr(text, network = 'Mainnet') {
  if (typeof text !== 'string') {
    return null;
  }
  let value = text.trim();
  if (/^bitcoin:/i.test(value)) {
    try {
      const query = value.split('?')[1] ?? '';
      if (
        query
          .split('&')
          .some(part =>
            decodeURIComponent(part.split('=')[0]).startsWith('req-'),
          )
      ) {
        return null;
      }
    } catch {
      return null;
    }
    value = value
      .replace(/^bitcoin:\/\//i, '')
      .replace(/^bitcoin:/i, '')
      .split('?')[0];
    try {
      value = decodeURIComponent(value);
    } catch {
      return null;
    }
  }
  return validBitcoinAddress(value, network) ? value : null;
}
