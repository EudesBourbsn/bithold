import { secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { concatBytes, utf8ToBytes } from '@noble/hashes/utils.js';
import { base64 } from '@scure/base';
import * as btc from '@scure/btc-signer';
import { VarBytes } from '@scure/btc-signer/script.js';
import { networkFor } from './keys/keyFormats';

export const MESSAGE_LIMIT = 10000;
const prefix = VarBytes.encode(utf8ToBytes('Bitcoin Signed Message:\n'));
const fail = code => Object.assign(new Error(code), { code });

function digest(message) {
  if (
    typeof message !== 'string' ||
    !message.length ||
    message.length > MESSAGE_LIMIT
  ) {
    throw fail('messageSigning.invalidMessage');
  }
  return sha256(
    sha256(concatBytes(prefix, VarBytes.encode(utf8ToBytes(message)))),
  );
}

export function messageAddress(address, network = 'Mainnet') {
  const codec = btc.Address(networkFor(network));
  let decoded;
  try {
    decoded = codec.decode(address.trim());
  } catch {
    throw fail('messageSigning.invalidAddress');
  }
  if (!['pkh', 'sh', 'wpkh'].includes(decoded.type)) {
    throw fail('messageSigning.unsupported');
  }
  return { type: decoded.type, address: codec.encode(decoded) };
}

function publicKeyAddress(publicKey, type, network) {
  const net = networkFor(network);
  if (type === 'pkh') return btc.p2pkh(publicKey, net).address;
  const witness = btc.p2wpkh(publicKey, net);
  return type === 'sh' ? btc.p2sh(witness, net).address : witness.address;
}

export function verifyBitcoinMessage(
  message,
  address,
  signature,
  network = 'Mainnet',
) {
  const expected = messageAddress(address, network);
  const hash = digest(message);
  try {
    const compact = base64.decode(signature.replace(/\s/g, ''));
    if (compact.length !== 65 || compact[0] < 27 || compact[0] > 42)
      return false;
    const header = compact[0];
    const offset =
      header >= 39 ? 39 : header >= 35 ? 35 : header >= 31 ? 31 : 27;
    if (offset === 27 && expected.type !== 'pkh') return false;
    if (offset === 35 && expected.type !== 'sh') return false;
    if (offset === 39 && expected.type !== 'wpkh') return false;
    compact[0] -= offset;
    const recovered = secp256k1.recoverPublicKey(compact, hash, {
      prehash: false,
    });
    const publicKey = secp256k1.Point.fromBytes(recovered).toBytes(
      offset !== 27,
    );
    return (
      publicKeyAddress(publicKey, expected.type, network) === expected.address
    );
  } catch {
    return false;
  }
}

export function signBitcoinMessage(
  message,
  row,
  privateKey,
  network = 'Mainnet',
) {
  const expected = messageAddress(row.address, network);
  const hash = digest(message);
  const publicKey = secp256k1.getPublicKey(privateKey, !row.uncompressed);
  if (
    publicKeyAddress(publicKey, expected.type, network) !== expected.address
  ) {
    throw fail('messageSigning.notOwned');
  }
  const signature = secp256k1.sign(hash, privateKey, {
    prehash: false,
    format: 'recovered',
  });
  signature[0] +=
    expected.type === 'wpkh'
      ? 39
      : expected.type === 'sh'
      ? 35
      : row.uncompressed
      ? 27
      : 31;
  const encoded = base64.encode(signature);
  if (!verifyBitcoinMessage(message, row.address, encoded, network)) {
    throw fail('messageSigning.failed');
  }
  return encoded;
}
