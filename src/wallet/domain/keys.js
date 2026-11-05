import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import * as btc from '@scure/btc-signer';

export { btc, bytesToHex, hexToBytes };
export {
  TYPES,
  TYPE_NAMES,
  typeName,
  PURPOSE,
  networkFor,
  parsePath,
  payment,
  encodeWif,
} from './keys/keyFormats';
export { descriptorChecksum, parseDescriptor } from './keys/descriptors';
export { createMaterial, importMaterial } from './keys/recoveryMaterial';
export {
  deriveAddress,
  privateKeysFor,
  rememberAddresses,
} from './keys/addressDerivation';
