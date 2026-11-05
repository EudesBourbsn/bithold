import { secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { base58check } from '@scure/base';
import { HDKey } from '@scure/bip32';
import * as btc from '@scure/btc-signer';
import { t } from '../../../i18n/core.js';

export const TYPES = ['legacy', 'nestedSegwit', 'nativeSegwit', 'taproot'];
export const TYPE_NAMES = {
  legacy: 'Legacy',
  nestedSegwit: 'Nested SegWit',
  nativeSegwit: 'Native SegWit',
  taproot: 'Taproot',
  descriptor: 'Custom script',
};
// The name shown in the app: script types keep their protocol names, a
// custom script is described in the app's language.
export const typeName = type =>
  type === 'descriptor' ? t('addressType.descriptor') : TYPE_NAMES[type];
export const PURPOSE = {
  legacy: 44,
  nestedSegwit: 49,
  nativeSegwit: 84,
  taproot: 86,
};
export const b58 = base58check(sha256);
export const VERSIONS = [
  {
    private: 0x0488ade4,
    public: 0x0488b21e,
  },
  {
    private: 0x049d7878,
    public: 0x049d7cb2,
    type: 'nestedSegwit',
  },
  {
    private: 0x04b2430c,
    public: 0x04b24746,
    type: 'nativeSegwit',
  },
  {
    private: 0x04358394,
    public: 0x043587cf,
    test: true,
  },
  {
    private: 0x044a4e28,
    public: 0x044a5262,
    type: 'nestedSegwit',
    test: true,
  },
  {
    private: 0x045f18bc,
    public: 0x045f1cf6,
    type: 'nativeSegwit',
    test: true,
  },
];
export function networkFor(name = 'Mainnet') {
  if (name === 'Mainnet') {
    return btc.NETWORK;
  }
  if (name === 'testnet' || name === 'signet') {
    return btc.TEST_NETWORK;
  }
  if (name === 'regtest') {
    return {
      ...btc.TEST_NETWORK,
      bech32: 'bcrt',
    };
  }
  throw new Error(t('error.keys.unsupportedBitcoinNetwork'));
}
export function parsePath(value) {
  if (!/^m(?:\/(?:0|[1-9]\d*)(?:'|h)?)*$/.test(value) || value.length > 180) {
    throw new Error(t('error.keys.invalidDerivationPath'));
  }
  if (
    value
      .split('/')
      .slice(1)
      .some(v => Number(v.replace(/['h]/g, '')) >= 0x80000000)
  ) {
    throw new Error(t('error.keys.derivationIndexTooLarge'));
  }
  return value.replace(/h/g, "'");
}
export function extended(text, network) {
  const raw = b58.decode(text);
  if (raw.length !== 78) {
    throw new Error(t('error.keys.invalidExtendedKey'));
  }
  const version = new DataView(raw.buffer, raw.byteOffset).getUint32(0);
  const versions = VERSIONS.find(
    v => v.public === version || v.private === version,
  );
  if (!versions || !!versions.test !== (network !== 'Mainnet')) {
    throw new Error(t('error.keys.keyBelongsDifferentBitcoinNetwork'));
  }
  return {
    node: HDKey.fromExtendedKey(text, versions),
    type: versions.type,
  };
}
export function wif(text, network) {
  const raw = b58.decode(text);
  if (
    raw[0] !== networkFor(network).wif ||
    ![33, 34].includes(raw.length) ||
    (raw.length === 34 && raw[33] !== 1)
  ) {
    throw new Error(t('error.keys.invalidPrivateKeyNetwork'));
  }
  const key = raw.slice(1, 33);
  secp256k1.getPublicKey(key);
  return {
    key,
    compressed: raw.length === 34,
  };
}
// A private key as WIF: the network's version byte, the 32-byte key and, for
// a compressed public key, a trailing 0x01, in base58check.
export function encodeWif(key, compressed, network) {
  const raw = new Uint8Array(compressed ? 34 : 33);
  raw[0] = networkFor(network).wif;
  raw.set(key, 1);
  if (compressed) {
    raw[33] = 1;
  }
  try {
    return b58.encode(raw);
  } finally {
    raw.fill(0);
  }
}
export function payment(publicKey, type, network = 'Mainnet') {
  const net = networkFor(network);
  if (type === 'legacy') {
    return btc.p2pkh(publicKey, net);
  }
  if (type === 'nestedSegwit') {
    return btc.p2sh(btc.p2wpkh(publicKey, net), net);
  }
  if (type === 'nativeSegwit') {
    return btc.p2wpkh(publicKey, net);
  }
  if (type === 'taproot') {
    return btc.p2tr(publicKey.slice(-32), undefined, net);
  }
  throw new Error(t('error.keys.unsupportedAddressType'));
}
