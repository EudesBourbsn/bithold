import { t } from '../../i18n/core.js';
import { deriveAddress, encodeWif, privateKeysFor } from '../domain/keys.js';

export class WalletRecovery {
  constructor(engine) {
    this.engine = engine;
  }
  async recoveryMaterial(id) {
    const engine = this.engine;
    const wallet = engine.wallet(id);
    if (wallet.watchOnly) {
      throw new Error(t('error.recovery.watchOnlyWalletHasNo'));
    }
    engine.wallet(id);
    const data = await engine.native.storageGet(engine.key(`secret:${id}`));
    engine.wallet(id);
    if (!data) {
      throw new Error(t('error.recovery.walletHasNoPrivateRecovery'));
    }
    const secret = JSON.parse(data);
    if (typeof secret.input !== 'string' || !secret.input.trim()) {
      throw new Error(t('error.recovery.recoveryMaterialUnavailable'));
    }
    return {
      kind: wallet.kind,
      input: secret.input,
      passphrase: secret.options?.passphrase ?? '',
    };
  }
  // The private key of one address (receive or change), as WIF, after the
  // owner authenticates.
  async addressPrivateKey(id, { type, chain, index }) {
    const engine = this.engine;
    const wallet = engine.wallet(id);
    if (wallet.watchOnly) {
      throw new Error(t('error.recovery.watchOnlyWalletHasNo2'));
    }
    const row = deriveAddress(wallet, type, chain, index);
    const data = await engine.native.storageGet(engine.key(`secret:${id}`));
    if (!data) {
      throw new Error(t('error.recovery.walletHasNoPrivateKeys'));
    }
    const keys = privateKeysFor(JSON.parse(data), row, wallet.network);
    try {
      if (keys.length !== 1) {
        throw new Error(t('error.recovery.addressControlledBySeveralKeys'));
      }
      return encodeWif(keys[0], !row.uncompressed, wallet.network);
    } finally {
      keys.forEach(key => key.fill(0));
    }
  }
  async reveal(id) {
    const engine = this.engine;
    const material = await engine.recoveryMaterial(id);
    return (
      material.input +
      (material.passphrase
        ? `\n\n${t('recovery.passphraseLabel')}\n` + material.passphrase
        : '')
    );
  }
}
