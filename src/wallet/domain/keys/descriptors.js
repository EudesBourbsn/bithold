import { secp256k1 } from '@noble/curves/secp256k1.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import * as btc from '@scure/btc-signer';
import { t } from '../../../i18n/core.js';
import { wif, extended, networkFor, payment } from './keyFormats';

export function descriptorChecksum(text) {
  const charset =
    '0123456789()[],\'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#"\\ ';
  const output = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const generators = [
    0xf5dee51989n,
    0xa9fdca3312n,
    0x1bab10e32dn,
    0x3706b1677an,
    0x644d626ffdn,
  ];
  let c = 1n,
    cls = 0,
    count = 0;
  const step = value => {
    const top = c >> 35n;
    c = ((c & 0x7ffffffffn) << 5n) ^ BigInt(value);
    for (let i = 0; i < 5; i++) {
      if ((top >> BigInt(i)) & 1n) {
        c ^= generators[i];
      }
    }
  };
  for (const char of text) {
    const pos = charset.indexOf(char);
    if (pos < 0) {
      throw new Error(t('error.descriptor.invalidDescriptorCharacter'));
    }
    step(pos & 31);
    cls = cls * 3 + (pos >> 5);
    if (++count === 3) {
      step(cls);
      cls = 0;
      count = 0;
    }
  }
  if (count) {
    step(cls);
  }
  for (let i = 0; i < 8; i++) {
    step(0);
  }
  c ^= 1n;
  return Array.from(
    {
      length: 8,
    },
    (_, i) => output[Number((c >> BigInt(5 * (7 - i))) & 31n)],
  ).join('');
}
export function splitArgs(text) {
  let depth = 0,
    start = 0;
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    if ('([<'.includes(text[i])) {
      depth++;
    }
    if (')]>'.includes(text[i])) {
      depth--;
    }
    if (text[i] === ',' && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
    if (depth < 0) {
      throw new Error(t('error.descriptor.invalidDescriptor'));
    }
  }
  if (depth !== 0) {
    throw new Error(t('error.descriptor.invalidDescriptor'));
  }
  parts.push(text.slice(start));
  return parts;
}
export function descriptorKey(text, network, publicOnly) {
  const clean = text.replace(/^\[[0-9a-fA-F]{8}(?:\/\d+['h]?)*\]/, '');
  const [base, ...suffix] = clean.split('/');
  if (
    suffix.length > 32 ||
    suffix.some(
      (v, i) =>
        !/^(?:\d+['h]?|<0;1>|\*)$/.test(v) ||
        (v === '*' && i !== suffix.length - 1),
    )
  ) {
    throw new Error(t('error.descriptor.invalidDescriptorDerivation'));
  }
  if (
    /^[0-9a-fA-F]{64}$|^(?:02|03)[0-9a-fA-F]{64}$|^04[0-9a-fA-F]{128}$/.test(
      base,
    )
  ) {
    if (suffix.length) {
      throw new Error(t('error.descriptor.publicKeysCannotHaveDerivation'));
    }
    return {
      publicKey: base.toLowerCase(),
      suffix: [],
    };
  }
  if (/^[5KLc9]/.test(base)) {
    if (suffix.length) {
      throw new Error(t('error.descriptor.privateKeysCannotHaveDerivation'));
    }
    const { key, compressed } = wif(base, network);
    const result = {
      publicKey: bytesToHex(secp256k1.getPublicKey(key, compressed)),
      suffix: [],
    };
    if (!publicOnly) {
      result.privateKey = bytesToHex(key);
    }
    key.fill(0);
    return result;
  }
  let { node } = extended(base, network);
  let rest = suffix;
  if (publicOnly && node.privateKey) {
    const lastHard = suffix.findLastIndex(v => /['h]$/.test(v));
    if (lastHard >= 0) {
      const prefix = suffix.slice(0, lastHard + 1);
      if (prefix.some(v => /[<*]/.test(v))) {
        throw new Error(t('error.descriptor.hardenedStepsMustPrecedeBranches'));
      }
      node = node.derive('m/' + prefix.join('/'));
      rest = suffix.slice(lastHard + 1);
    }
  }
  if (!node.privateKey && rest.some(v => /['h]$/.test(v))) {
    throw new Error(t('error.descriptor.publicKeyCannotDeriveHardened'));
  }
  const result = {
    extended:
      publicOnly || !node.privateKey
        ? node.publicExtendedKey
        : node.privateExtendedKey,
    suffix: rest,
  };
  node.wipePrivateData();
  return result;
}
export function parseDescriptor(input, network = 'Mainnet', publicOnly = true) {
  const pieces = input.trim().split('#');
  if (
    pieces.length > 2 ||
    (pieces.length === 2 && descriptorChecksum(pieces[0]) !== pieces[1])
  ) {
    throw new Error(t('error.descriptor.invalidDescriptorChecksum'));
  }
  const parse = (text, depth = 0) => {
    if (depth > 4) {
      throw new Error(t('error.descriptor.descriptorNestingTooDeep'));
    }
    const match = /^([a-z]+)\((.*)\)$/.exec(text);
    if (!match) {
      throw new Error(t('error.descriptor.invalidDescriptor'));
    }
    const [, op, body] = match;
    if (['pk', 'pkh', 'wpkh', 'tr'].includes(op)) {
      return {
        op,
        key: descriptorKey(body, network, publicOnly),
      };
    }
    if (['sh', 'wsh'].includes(op)) {
      const child = parse(body, depth + 1);
      const allowed =
        op === 'wsh'
          ? ['pk', 'pkh', 'multi', 'sortedmulti']
          : ['pk', 'pkh', 'wpkh', 'wsh', 'multi', 'sortedmulti'];
      if (!allowed.includes(child.op)) {
        throw new Error(t('error.descriptor.unsupportedDescriptorNesting'));
      }
      return {
        op,
        child,
      };
    }
    if (['multi', 'sortedmulti'].includes(op)) {
      const [m, ...keys] = splitArgs(body);
      if (
        !/^\d+$/.test(m) ||
        Number(m) < 1 ||
        Number(m) > keys.length ||
        keys.length > 16
      ) {
        throw new Error(t('error.descriptor.invalidMultisigThreshold'));
      }
      return {
        op,
        m: Number(m),
        keys: keys.map(k => descriptorKey(k, network, publicOnly)),
      };
    }
    throw new Error(t('error.descriptor.unsupportedDescriptorExpression'));
  };
  return parse(pieces[0]);
}
export function descriptorKeys(ast) {
  return ast.key ? [ast.key] : ast.keys ?? descriptorKeys(ast.child);
}
export function keyAt(key, chain, index, network) {
  if (!key.extended) {
    return {
      publicKey: hexToBytes(key.publicKey),
      privateKey: key.privateKey ? hexToBytes(key.privateKey) : null,
    };
  }
  let { node } = extended(key.extended, network);
  const suffix = key.suffix.map((s, i) =>
    s === '*'
      ? String(index)
      : s === '<0;1>' ||
        (s === '0' && i === key.suffix.length - 2 && key.suffix.at(-1) === '*')
      ? String(chain)
      : s,
  );
  if (suffix.length) {
    node = node.derive('m/' + suffix.join('/'));
  }
  const result = {
    publicKey: node.publicKey.slice(),
    privateKey: node.privateKey?.slice() ?? null,
  };
  node.wipePrivateData();
  return result;
}
export function descriptorPayment(ast, chain, index, network) {
  const net = networkFor(network);
  if (ast.child) {
    return btc[ast.op === 'sh' ? 'p2sh' : 'p2wsh'](
      descriptorPayment(ast.child, chain, index, network),
      net,
    );
  }
  if (ast.keys) {
    const pubs = ast.keys.map(k => keyAt(k, chain, index, network).publicKey);
    if (new Set(pubs.map(bytesToHex)).size !== pubs.length) {
      throw new Error(t('error.descriptor.duplicateMultisigKeys'));
    }
    if (ast.op === 'sortedmulti') {
      pubs.sort((a, b) => bytesToHex(a).localeCompare(bytesToHex(b)));
    }
    return btc.p2ms(ast.m, pubs);
  }
  const pub = keyAt(ast.key, chain, index, network).publicKey;
  if (pub.length === 65 && ['wpkh', 'tr'].includes(ast.op)) {
    throw new Error(t('error.descriptor.descriptorRequiresCompressedXOnly'));
  }
  if (ast.op === 'pk') {
    return btc.p2pk(pub);
  }
  return payment(
    pub,
    {
      pkh: 'legacy',
      wpkh: 'nativeSegwit',
      tr: 'taproot',
    }[ast.op],
    network,
  );
}
