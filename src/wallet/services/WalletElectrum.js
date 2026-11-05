import { CHAINS } from '../network/electrum.js';

// Bithold syncs over its built-in Electrum servers, on mainnet only. Earlier
// versions kept user server settings here (an on/off switch, a personal
// server, test networks); they are dropped when the state loads, so every
// install is back on the built-in servers.
export const DEFAULT_ELECTRUM = Object.freeze({
  chain: 'Mainnet',
  variants: Object.freeze({}),
});

export function electrumState(data) {
  const source = data && typeof data === 'object' ? data : {};
  // The network variant each server reported (testnet3 or testnet4), kept
  // for a wallet's explorer and broadcast links.
  const variants =
    source.variants && typeof source.variants === 'object'
      ? Object.fromEntries(
          Object.entries(source.variants).filter(
            ([name, value]) =>
              CHAINS[name] &&
              Object.values(CHAINS[name].genesis).includes(value),
          ),
        )
      : {};
  return { chain: 'Mainnet', variants };
}

export class WalletElectrum {
  constructor(engine) {
    this.engine = engine;
  }
  // The network whose wallets are shown and synced.
  chain() {
    return this.engine.state.electrum?.chain ?? 'Mainnet';
  }
}
