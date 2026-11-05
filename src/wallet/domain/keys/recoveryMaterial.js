import { secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { HDKey } from '@scure/bip32';
import {
  entropyToMnemonic,
  mnemonicToSeedSync,
  validateMnemonic,
} from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import * as btc from '@scure/btc-signer';
import { t } from '../../../i18n/core.js';
import { deriveAddress } from './addressDerivation';
import { parseDescriptor, descriptorKeys } from './descriptors';
import {
  networkFor,
  TYPES,
  TYPE_NAMES,
  parsePath,
  extended,
  PURPOSE,
  wif,
  VERSIONS,
} from './keyFormats';

export function createMaterial(entropyHex) {
  return entropyToMnemonic(hexToBytes(entropyHex), wordlist);
}
export function importMaterial(input, options = {}) {
  const network = options.network ?? 'Mainnet';
  networkFor(network);
  const selected = TYPES.find(
    type =>
      TYPE_NAMES[type] === options.addressType || type === options.addressType,
  );
  const path = options.derivationPath
    ? parsePath(options.derivationPath)
    : null;
  const text = input.trim();
  if (!text || text.length > 16384) {
    throw new Error(t('error.keys.enterRecoveryPhraseKeyDescriptor'));
  }
  const result = {
    network,
    standard: selected ?? 'nativeSegwit',
    accounts: [],
    exposed: {},
    kind: 'mnemonic',
    watchOnly: false,
  };
  const secret = {
    input: text,
    options: {
      ...options,
      network,
    },
  };
  if (/^(?:pkh|wpkh|sh|wsh|tr|pk|multi|sortedmulti)\(/.test(text)) {
    result.kind = 'descriptor';
    result.descriptor = parseDescriptor(text, network);
    const privateAst = parseDescriptor(text, network, false);
    const signingKeys = descriptorKeys(privateAst).filter(
      k => k.privateKey || /prv/.test(k.extended ?? ''),
    ).length;
    let inner = privateAst;
    while (inner.child) {
      inner = inner.child;
    }
    result.watchOnly = signingKeys < (inner.m ?? 1);
    result.fixed = !descriptorKeys(result.descriptor).some(k =>
      k.suffix.includes('*'),
    );
    result.chains = result.fixed
      ? [0]
      : descriptorKeys(result.descriptor).some(
          k =>
            k.suffix.includes('<0;1>') ||
            k.suffix.slice(-2).join('/') === '0/*',
        )
      ? [0, 1]
      : [0];
    result.standard = 'descriptor';
    result.accounts = [
      {
        type: 'descriptor',
        path: 'descriptor',
      },
    ];
  } else if (/^(?:[xyztuv]pub|[xyztuv]prv)/.test(text.replace(/ /g, ''))) {
    const decoded = extended(text, network);
    let { node } = decoded;
    result.kind = node.privateKey ? 'extendedPrivateKey' : 'extendedPublicKey';
    result.watchOnly = !node.privateKey;
    let types =
      node.depth === 0
        ? TYPES
        : decoded.type
        ? [decoded.type]
        : selected
        ? [selected]
        : ['legacy', 'taproot'];
    if (path) {
      types = [selected ?? 'nativeSegwit'];
    }
    result.accounts = types.map(type => {
      const route =
        path ??
        (node.depth === 0
          ? `m/${PURPOSE[type]}'/${network === 'Mainnet' ? 0 : 1}'/0'`
          : 'm');
      const account = route === 'm' ? node : node.derive(route);
      const row = {
        type,
        xpub: account.publicExtendedKey,
        path: route,
      };
      if (account !== node) {
        account.wipePrivateData();
      }
      return row;
    });
    node.wipePrivateData();
  } else if (/^[5KLc9][1-9A-HJ-NP-Za-km-z]{49,51}$/.test(text)) {
    const { key, compressed } = wif(text, network);
    result.kind = 'wif';
    result.fixed = true;
    result.publicKey = bytesToHex(secp256k1.getPublicKey(key, compressed));
    result.accounts = (compressed ? TYPES : ['legacy']).map(type => ({
      type,
      path: 'WIF',
    }));
    key.fill(0);
  } else {
    try {
      const decoded = btc.Address(networkFor(network)).decode(text);
      result.kind = 'address';
      result.fixed = true;
      result.watchOnly = true;
      result.address = text;
      result.script = bytesToHex(btc.OutScript.encode(decoded));
      result.standard =
        {
          pkh: 'legacy',
          sh: 'nestedSegwit',
          wpkh: 'nativeSegwit',
          tr: 'taproot',
        }[decoded.type] ?? 'descriptor';
      result.accounts = [
        {
          type: result.standard,
          path: 'address',
        },
      ];
    } catch {
      const phrase = text.toLowerCase().split(/\s+/).join(' ');
      if (!validateMnemonic(phrase, wordlist)) {
        throw new Error(t('error.keys.invalidRecoveryPhraseCheckEvery'));
      }
      secret.input = phrase;
      const seed = mnemonicToSeedSync(phrase, options.passphrase ?? '');
      const root = HDKey.fromMasterSeed(
        seed,
        network === 'Mainnet' ? VERSIONS[0] : VERSIONS[3],
      );
      seed.fill(0);
      result.accounts = (path ? [selected ?? 'nativeSegwit'] : TYPES).map(
        type => {
          const route =
            path ?? `m/${PURPOSE[type]}'/${network === 'Mainnet' ? 0 : 1}'/0'`;
          const account = root.derive(route);
          const row = {
            type,
            path: route,
            xpub: account.publicExtendedKey,
          };
          account.wipePrivateData();
          return row;
        },
      );
      root.wipePrivateData();
    }
  }
  if (!result.accounts.some(a => a.type === result.standard)) {
    result.standard = result.accounts[0].type;
  }
  result.identity = bytesToHex(
    sha256(
      new TextEncoder().encode(
        JSON.stringify([
          network,
          result.accounts,
          result.publicKey,
          result.descriptor,
          result.address,
        ]),
      ),
    ),
  );
  deriveAddress(result, result.standard, 0, 0);
  return {
    wallet: result,
    secret: result.watchOnly ? null : secret,
  };
}
