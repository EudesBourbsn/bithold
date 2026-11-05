import { t } from '../../i18n/core.js';
import { CURRENCY_CODES } from '../config/currencies.js';
import { DEFAULT_PREFERENCES } from '../config/preferences.js';
import { rememberAddresses } from '../domain/keys.js';
import { CHART_RANGES } from '../network/charts.js';
import { freshFees } from '../network/fees.js';
import { validRate } from '../network/rates.js';
import { electrumState } from './WalletElectrum.js';
import { securityState } from './WalletSecurity.js';

export class WalletStorage {
  constructor(engine) {
    this.engine = engine;
  }
  key(name) {
    const engine = this.engine;
    return engine.prefix + name;
  }
  async save() {
    const engine = this.engine;
    const text = JSON.stringify(engine.state);
    const write = engine.saving.then(() =>
      engine.native.storageSet(engine.key('state'), text),
    );
    engine.saving = write.catch(() => {});
    await write;
  }
  async saveSnapshot(id, snapshot, alive) {
    const engine = this.engine;
    const prior = engine.snapshotWrites.get(id) ?? Promise.resolve();
    const write = prior
      .catch(() => {})
      .then(async () => {
        if (alive()) {
          await engine.native.storageSet(
            engine.key(`snapshot:${id}`),
            JSON.stringify(snapshot),
          );
        }
      });
    engine.snapshotWrites.set(id, write);
    try {
      await write;
    } finally {
      if (engine.snapshotWrites.get(id) === write) {
        engine.snapshotWrites.delete(id);
      }
    }
  }
  async load() {
    const engine = this.engine;
    try {
      const text = await engine.native.storageGet(engine.key('state'));
      if (text) {
        const data = JSON.parse(text);
        if (
          !Array.isArray(data.wallets) ||
          data.wallets.some(w => !w.id || !w.accounts)
        ) {
          throw new Error(t('error.storage.walletMetadataDamaged'));
        }
        engine.state = {
          ...engine.state,
          ...data,
          preferences: {
            ...DEFAULT_PREFERENCES,
            ...data.preferences,
          },
          pending: data.pending ?? [],
          notes: data.notes && typeof data.notes === 'object' ? data.notes : {},
          security: securityState(data.security),
          electrum: electrumState(data.electrum),
          preferredPeers: Array.isArray(data.preferredPeers)
            ? data.preferredPeers
                .filter(value => typeof value === 'string')
                .slice(0, 4)
            : [],
        };
      }
      for (const wallet of engine.state.wallets) {
        const cached = await engine.native.storageGet(
          engine.key(`snapshot:${wallet.id}`),
        );
        if (cached) {
          try {
            const snapshot = JSON.parse(cached);
            if (
              Array.isArray(snapshot.coins) &&
              Array.isArray(snapshot.transactions) &&
              Number.isSafeInteger(snapshot.balance) &&
              snapshot.balance >= 0
            ) {
              engine.snapshots.set(wallet.id, snapshot);
              rememberAddresses(wallet, snapshot.addresses);
              engine.status.set(wallet.id, {
                phase: 'cached',
                updated: snapshot.updated,
              });
            }
          } catch {}
        }
      }
      const marketText = await engine.native.storageGet(engine.key('market'));
      if (marketText) {
        try {
          const cached = JSON.parse(marketText);
          const quotes = Object.fromEntries(
            Object.entries(cached.quotes ?? {}).filter(
              ([currency, value]) =>
                /^[A-Z]{3}$/.test(currency) &&
                Number.isFinite(value) &&
                value > 0,
            ),
          );
          if (Object.keys(quotes).length && Number.isFinite(cached.updated)) {
            engine.market = {
              quotes,
              quoteMeta: Object.fromEntries(
                Object.keys(quotes).map(code => [
                  code,
                  cached.quoteMeta?.[code] ?? {
                    source: 'cached',
                    updated: cached.updated,
                  },
                ]),
              ),
              updated: cached.updated,
              history: Array.isArray(cached.history)
                ? cached.history.filter(v => Number.isFinite(v) && v > 0)
                : [],
              historyCurrency: cached.historyCurrency,
              charts: Object.fromEntries(
                Object.entries(cached.charts ?? {}).filter(
                  ([key, chart]) =>
                    CURRENCY_CODES.includes(key.split(':')[0]) &&
                    CHART_RANGES.includes(key.split(':')[1] ?? '1D') &&
                    chart?.currency === key.split(':')[0] &&
                    Array.isArray(chart.points) &&
                    chart.points.length >= 2 &&
                    chart.points.every(
                      p => Number.isFinite(p.time) && validRate(p.price),
                    ),
                ),
              ),
            };
          }
        } catch {}
      }
      try {
        const cachedFees = JSON.parse(
          (await engine.native.storageGet(engine.key('fees'))) ?? 'null',
        );
        // The cache holds mainnet estimates only.
        if (freshFees(cachedFees) && engine.electrum.chain() === 'Mainnet') {
          engine.fees = cachedFees;
        }
      } catch {}
      engine.ready = true;
      engine.feesNetwork = engine.electrum.chain();
      engine.adoptChain();
      engine.emit();
      engine.start();
    } catch {
      engine.loadError = t('error.storage.openFailed');
      engine.emit();
      throw new Error(engine.loadError);
    }
  }
  async saveMarket() {
    const engine = this.engine;
    if (engine.market.updated != null) {
      await engine.native
        .storageSet(engine.key('market'), JSON.stringify(engine.market))
        .catch(() => {});
    }
  }
}
