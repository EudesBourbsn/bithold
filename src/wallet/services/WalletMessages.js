import { deriveAddress, privateKeysFor } from '../domain/keys';
import { messageAddress, signBitcoinMessage } from '../domain/messageSignature';

export class WalletMessages {
  constructor(engine) {
    this.engine = engine;
  }

  async sign(id, item, address, message) {
    const engine = this.engine;
    const wallet = engine.wallet(id);
    const generation = engine.generation;
    const fail = code => Object.assign(new Error(code), { code });
    if (wallet.watchOnly) throw fail('messageSigning.watchOnly');
    const row = deriveAddress(wallet, item.type, item.chain, item.index, {
      verify: true,
    });
    const requested = messageAddress(address, wallet.network).address;
    if (requested !== messageAddress(row.address, wallet.network).address) {
      throw fail('messageSigning.notOwned');
    }
    let stored;
    let secret;
    let keys = [];
    try {
      stored = await engine.native.storageGet(engine.key(`secret:${id}`));
      if (
        engine.generation !== generation ||
        engine.wallet(id) !== wallet ||
        !engine.active
      ) {
        throw fail('cancelled');
      }
      if (!stored) throw fail('messageSigning.unavailable');
      secret = JSON.parse(stored);
      keys = privateKeysFor(secret, row, wallet.network);
      if (keys.length !== 1) throw fail('messageSigning.unsupported');
      return signBitcoinMessage(message, row, keys[0], wallet.network);
    } finally {
      keys.forEach(key => key.fill(0));
      stored = null;
      secret = null;
    }
  }
}
