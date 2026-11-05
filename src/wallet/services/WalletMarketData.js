import { chartKey } from '../network/charts.js';
import { fetchFees } from '../network/fees.js';
import { validRate } from '../network/rates.js';

export class WalletMarketData {
  constructor(engine) {
    this.engine = engine;
  }
  async refreshMarket() {
    const engine = this.engine;
    if (engine.marketJob) {
      return engine.marketJob;
    }
    engine.marketJob = engine.updateMarket();
    try {
      return await engine.marketJob;
    } finally {
      engine.marketJob = null;
    }
  }
  async applyRates(batch) {
    const engine = this.engine;
    if (!Object.keys(batch.quotes).length) {
      return;
    }
    engine.market = {
      ...engine.market,
      quotes: {
        ...engine.market.quotes,
        ...batch.quotes,
      },
      quoteMeta: {
        ...engine.market.quoteMeta,
        ...batch.meta,
      },
      updated: Date.now(),
    };
    engine.emit();
    await engine.saveMarket();
  }
  async refreshRates(currency = this.engine.state.preferences.currency) {
    const engine = this.engine;
    engine.rates.fetcher = engine.fetcher;
    if (
      !engine.rateJob &&
      Date.now() - (engine.lastRatesAttempt ?? 0) < 30000 &&
      validRate(engine.market.quotes[currency])
    ) {
      return;
    }
    if (!engine.rateJob) {
      engine.lastRatesAttempt = Date.now();
      engine.rateJob = engine.rates.batch(batch => engine.applyRates(batch));
      engine.rateJob.finally(() => {
        engine.rateJob = null;
      });
    }
    const batch = await engine.rateJob;
    if (!batch.quotes[currency]) {
      try {
        await engine.applyRates(await engine.rates.single(currency));
      } catch (error) {
        engine.rateError = error.message;
      }
    } else {
      engine.rateError = null;
    }
    engine.marketFailures = {
      ...engine.rates.errors,
    };
  }
  async updateMarket() {
    const engine = this.engine;
    await Promise.allSettled([
      engine.refreshRates(),
      engine.refreshMarketDetails(),

      engine.refreshChart(
        engine.state.preferences.currency,
        engine.chartRange ?? '1D',
      ),
    ]);
  }
  async refreshChart(currency, range = '1D', { retry = false } = {}) {
    const engine = this.engine;
    const key = chartKey(currency, range);
    const cached = engine.market.charts[key];
    if (retry) {
      engine.chartClient.retry(currency, range);
    } else if (cached && Date.now() - cached.updated < 15 * 60000) {
      return cached;
    }
    if (engine.chartJobs.has(key)) {
      return engine.chartJobs.get(key);
    }
    engine.chartClient.fetcher = engine.fetcher;
    const job = (async () => {
      try {
        const chart = await engine.chartClient.get(currency, range);
        engine.chartError = null;
        engine.market = {
          ...engine.market,
          charts: {
            ...engine.market.charts,
            [key]: chart,
          },
        };
        engine.emit();
        await engine.saveMarket();
        return chart;
      } catch (error) {
        engine.chartError = error.message;
        return cached ?? null;
      } finally {
        engine.chartJobs.delete(key);
      }
    })();
    engine.chartJobs.set(key, job);
    return job;
  }
  async refreshMarketDetails() {
    const engine = this.engine;
    if (engine.feeJob) {
      return engine.feeJob;
    }
    const job = engine.updateFees();
    engine.feeJob = job;
    try {
      await job;
    } finally {
      engine.feeJob = null;
    }
  }
  async updateFees() {
    const engine = this.engine;
    try {
      const network = engine.electrum.chain();
      const fees = await fetchFees(
        engine.fetcher,
        network,
        engine.state.electrum?.variants?.[network],
      );
      if (network !== engine.electrum.chain()) {
        return;
      }
      engine.fees = fees;
      engine.emit();
      // Mainnet's estimates are kept for the next launch.
      if (network === 'Mainnet') {
        await engine.native.storageSet(
          engine.key('fees'),
          JSON.stringify(engine.fees),
        );
      }
    } catch {}
  }
}
