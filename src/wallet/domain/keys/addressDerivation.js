import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import * as btc from '@scure/btc-signer';
import { t } from '../../../i18n/core.js';
import {
  descriptorPayment,
  descriptorKeys,
  keyAt,
  parseDescriptor,
} from './descriptors';
import { extended, networkFor, payment, wif, VERSIONS } from './keyFormats';

const derivedRows = new WeakMap();
const chainNodes = new WeakMap();
function entries(cache, wallet) {
  let map = cache.get(wallet);
  if (!map) {
    map = new Map();
    cache.set(wallet, map);
  }
  return map;
}
function chainNode(wallet, account, chain) {
  const nodes = entries(chainNodes, wallet);
  const key = `${account.type}:${chain}`;
  let node = nodes.get(key);
  if (!node) {
    node = extended(account.xpub, wallet.network).node.deriveChild(chain);
    nodes.set(key, node);
  }
  return node;
}
const DERIVED_FIELDS = [
  'address',
  'script',
  'scriptHash',
  'type',
  'chain',
  'index',
  'uncompressedPublicKeys',
  'uncompressed',
  'path',
  'redeemScript',
  'witnessScript',
  'tapInternalKey',
];

function savedRowMatches(row, network) {
  try {
    return (
      btc
        .Address(networkFor(network))
        .encode(btc.OutScript.decode(hexToBytes(row.script))) === row.address
    );
  } catch {
    return false;
  }
}

export function rememberAddresses(wallet, saved = []) {
  const rows = entries(derivedRows, wallet);
  for (const row of saved) {
    const key = `${row.type}:${row.chain}:${row.index}`;
    const account = wallet.accounts?.find(a => a.type === row.type);
    if (
      !rows.has(key) &&
      account &&
      savedRowMatches(row, wallet.network) &&
      [0, 1].includes(row.chain) &&
      Number.isInteger(row.index) &&
      typeof row.address === 'string' &&
      typeof row.script === 'string' &&
      /^[0-9a-f]+$/i.test(row.script) &&
      typeof row.scriptHash === 'string' &&
      row.scriptHash === bytesToHex(sha256(hexToBytes(row.script)).reverse()) &&
      row.path ===
        (wallet.fixed
          ? account.path
          : `${account.path}/${row.chain}/${row.index}`)
    ) {
      rows.set(key, Object.fromEntries(DERIVED_FIELDS.map(f => [f, row[f]])));
    }
  }
}

export function deriveAddress(wallet, type, chain, index, { verify } = {}) {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= 100000 ||
    ![0, 1].includes(chain)
  ) {
    throw new Error(t('error.keys.invalidAddressIndex'));
  }
  const account = wallet.accounts.find(a => a.type === type);
  if (!account || (wallet.fixed && (chain || index))) {
    throw new Error(t('error.keys.addressBranchUnavailable'));
  }
  const rows = entries(derivedRows, wallet);
  const cacheKey = `${type}:${chain}:${index}`;
  if (rows.has(cacheKey) && !verify) {
    return rows.get(cacheKey);
  }
  let pay;
  if (wallet.address) {
    pay = {
      address: wallet.address,
      script: hexToBytes(wallet.script),
    };
  } else if (wallet.descriptor) {
    pay = descriptorPayment(wallet.descriptor, chain, index, wallet.network);
  } else {
    let pub;
    if (wallet.publicKey) {
      pub = hexToBytes(wallet.publicKey);
    } else {
      pub = chainNode(wallet, account, chain).deriveChild(index).publicKey;
    }
    pay = payment(pub, type, wallet.network);
  }
  if (!pay.address) {
    throw new Error(t('error.keys.descriptorMustProduceAddressableOutput'));
  }
  const uncompressedPublicKeys = wallet.descriptor
    ? descriptorKeys(wallet.descriptor)
        .map(k => keyAt(k, chain, index, wallet.network).publicKey)
        .filter(k => k.length === 65)
        .map(bytesToHex)
    : wallet.publicKey?.length === 130
    ? [wallet.publicKey]
    : [];
  if (
    uncompressedPublicKeys.length &&
    (pay.witnessScript || wallet.descriptor?.op === 'wpkh')
  ) {
    throw new Error(t('error.keys.witnessScriptsRequireCompressedPublic'));
  }
  const row = {
    address: pay.address,
    script: bytesToHex(pay.script),
    scriptHash: bytesToHex(sha256(pay.script).reverse()),
    type,
    chain,
    index,
    uncompressedPublicKeys,
    uncompressed:
      uncompressedPublicKeys.length > 0 &&
      (wallet.descriptor?.op === 'pkh' ||
        wallet.descriptor?.child?.op === 'pkh' ||
        wallet.publicKey?.length === 130),
    path: wallet.fixed ? account.path : `${account.path}/${chain}/${index}`,
    redeemScript: pay.redeemScript ? bytesToHex(pay.redeemScript) : null,
    witnessScript: pay.witnessScript ? bytesToHex(pay.witnessScript) : null,
    tapInternalKey: pay.tapInternalKey ? bytesToHex(pay.tapInternalKey) : null,
  };
  rows.set(cacheKey, row);
  return row;
}
export function privateKeysFor(secret, row, network) {
  if (/^(?:pkh|wpkh|sh|wsh|tr|pk|multi|sortedmulti)\(/.test(secret.input)) {
    const ast = parseDescriptor(secret.input, network, false);
    return descriptorKeys(ast)
      .map(k => keyAt(k, row.chain, row.index, network).privateKey)
      .filter(Boolean);
  }
  if (row.path === 'WIF') {
    return [wif(secret.input, network).key];
  }
  let root;
  if (/prv/.test(secret.input.slice(0, 4))) {
    root = extended(secret.input, network).node;
  } else {
    const seed = mnemonicToSeedSync(
      secret.input,
      secret.options.passphrase ?? '',
    );
    root = HDKey.fromMasterSeed(
      seed,
      network === 'Mainnet' ? VERSIONS[0] : VERSIONS[3],
    );
    seed.fill(0);
  }
  const derived = root.derive(row.path);
  const key = derived.privateKey?.slice();
  derived.wipePrivateData();
  root.wipePrivateData();
  if (!key) {
    throw new Error(t('error.keys.walletCannotSign'));
  }
  return [key];
}
