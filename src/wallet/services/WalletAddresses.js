import { deriveAddress } from '../domain/keys.js';

export class WalletAddresses {
  constructor(engine) {
    this.engine = engine;
  }
  async receive(
    id,
    type = this.engine.wallet(id).standard,
    chain = 0,
    rotate = false,
  ) {
    const engine = this.engine;
    const wallet = engine.wallet(id);
    const key = `${type}:${chain}`;
    const rows = engine.snapshots.get(id)?.addresses ?? [];
    const branch = rows.filter(row => row.type === type && row.chain === chain);
    const used = Math.max(
      -1,
      ...branch.filter(row => row.history.length).map(row => row.index),
    );
    const watched = Math.max(-1, ...branch.map(row => row.index));
    const exposed = wallet.exposed[key] ?? 0;
    const index = wallet.fixed
      ? 0
      : Math.max(used + 1, exposed + (rotate ? 1 : 0));
    const row = deriveAddress(wallet, type, chain, index, { verify: true });
    wallet.exposed = {
      ...wallet.exposed,
      [key]: index,
    };
    await engine.save();
    engine.emit();
    if (index > watched) {
      // A scan already running read the old `exposed`: force runs one more,
      // only when it grew.
      engine.refresh(id, { force: index !== exposed }).catch(() => {});
    }
    return row;
  }
}
