import { DEFAULT_PREFERENCES } from './config/preferences.js';
import { ChartClient } from './network/charts.js';
import { Electrum, MAINNET_PEERS } from './network/electrum.js';
import { RateClient } from './network/rates.js';
import { WalletAccounts } from './services/WalletAccounts.js';
import { WalletAddresses } from './services/WalletAddresses.js';
import { DEFAULT_ELECTRUM, WalletElectrum } from './services/WalletElectrum.js';
import { WalletMarketData } from './services/WalletMarketData.js';
import { WalletMessages } from './services/WalletMessages.js';
import { WalletPayments } from './services/WalletPayments.js';
import { WalletPreferences } from './services/WalletPreferences.js';
import { WalletRecovery } from './services/WalletRecovery.js';
import { WalletSecurity } from './services/WalletSecurity.js';
import { WalletStorage } from './services/WalletStorage.js';
import { WalletSynchronization } from './services/WalletSynchronization.js';
import { scanWallet } from './synchronization/scanWallet.js';

export class WalletEngine {
  constructor(
    native,
    events,
    {
      fetcher = fetch,
      clientFactory,
      scanner = scanWallet,
      storagePrefix = '',
    } = {},
  ) {
    this.native = native;
    this.scanner = scanner;
    this.fetcher = fetcher;
    this.prefix = storagePrefix;
    this.clientFactory =
      clientFactory ??
      (() => {
        // Bithold's built-in servers, the recently successful ones first.
        const preferred = this.state.preferredPeers ?? [];
        const peers = [...MAINNET_PEERS].sort(
          (a, b) =>
            (preferred.includes(a[0]) ? preferred.indexOf(a[0]) : 100) -
            (preferred.includes(b[0]) ? preferred.indexOf(b[0]) : 100),
        );
        return new Electrum(native, events, peers, this.electrum.chain());
      });
    this.state = {
      wallets: [],
      selectedId: null,
      preferences: {
        ...DEFAULT_PREFERENCES,
      },
      pending: [],

      notes: {},
      security: null,
      electrum: { ...DEFAULT_ELECTRUM, variants: {} },
    };
    this.rates = new RateClient(fetcher);
    this.chartClient = new ChartClient(fetcher);
    this.chartJobs = new Map();
    this.ready = false;
    this.active = true;
    this.listeners = new Set();
    this.activityListeners = new Set();
    this.snapshots = new Map();
    this.status = new Map();
    this.clients = new Map();
    this.jobs = new Map();
    this.plans = new Map();
    this.signing = false;
    this.generation = 0;
    this.previewCache = new Map();
    this.refreshDirty = new Set();
    this.refreshPasses = new Map();
    this.snapshotWrites = new Map();
    this.market = {
      quotes: {},
      quoteMeta: {},
      charts: {},
      history: [],
      updated: null,
    };
    this.fees = null;
    this.saving = Promise.resolve();
    this.refreshTimers = new Map();
    this.storage = new WalletStorage(this);
    this.accounts = new WalletAccounts(this);
    this.synchronization = new WalletSynchronization(this);
    this.marketData = new WalletMarketData(this);
    this.settings = new WalletPreferences(this);
    this.recovery = new WalletRecovery(this);
    this.messages = new WalletMessages(this);
    this.addresses = new WalletAddresses(this);
    this.paymentCoordinator = new WalletPayments(this);
    this.security = new WalletSecurity(this);
    this.electrum = new WalletElectrum(this);
  }
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  emit() {
    for (const fn of this.listeners) {
      fn();
    }
  }
  // Incoming-funds announcements ({ walletId, kind, satoshis, txids }).
  onActivity(fn) {
    this.activityListeners.add(fn);
    return () => this.activityListeners.delete(fn);
  }
  emitActivity(event) {
    for (const fn of this.activityListeners) {
      fn(event);
    }
  }
  onChain(wallet) {
    return (wallet?.network ?? 'Mainnet') === this.electrum.chain();
  }
  // Keeps the selection on the active network after it changes.
  adoptChain() {
    const selected = this.state.wallets.find(
      w => w.id === this.state.selectedId,
    );
    if (!selected || !this.onChain(selected)) {
      const next = this.state.wallets.find(w => this.onChain(w))?.id ?? null;
      if (next !== this.state.selectedId) {
        this.state.selectedId = next;
        this.save().catch(() => {});
      }
    }
    if (this.ready && this.feesNetwork !== this.electrum.chain()) {
      this.feesNetwork = this.electrum.chain();
      this.fees = null;
      this.updateFees().catch(() => {});
    }
    this.emit();
  }
  view() {
    const visible = this.state.wallets.filter(w => this.onChain(w));
    return {
      ...this.state,
      ready: this.ready,
      market: this.market,
      fees: this.fees,
      network: this.electrum.chain(),
      walletCount: this.state.wallets.length,
      selectedId: visible.some(w => w.id === this.state.selectedId)
        ? this.state.selectedId
        : visible[0]?.id ?? null,
      wallets: visible.map(wallet => ({
        ...wallet,
        snapshot: this.snapshots.get(wallet.id),
        sync: this.status.get(wallet.id) ?? {
          phase: 'waiting',
        },
      })),
    };
  }
  key(name) {
    return this.storage.key(name);
  }
  save() {
    return this.storage.save();
  }
  saveSnapshot(id, snapshot, alive) {
    return this.storage.saveSnapshot(id, snapshot, alive);
  }
  load() {
    return this.storage.load();
  }
  saveMarket() {
    return this.storage.saveMarket();
  }
  add(input, options, configuration) {
    return this.accounts.add(input, options, configuration);
  }
  create(options) {
    return this.accounts.create(options);
  }
  markBackedUp(id) {
    return this.accounts.markBackedUp(id);
  }
  markRecoveryOnboardingSeen(id) {
    return this.accounts.markRecoveryOnboardingSeen(id);
  }
  update(id, changes) {
    return this.accounts.update(id, changes);
  }
  wallet(id) {
    return this.accounts.wallet(id);
  }
  select(id) {
    return this.accounts.select(id);
  }
  remove(id, options) {
    return this.accounts.remove(id, options);
  }
  clear(options) {
    return this.accounts.clear(options);
  }
  setNote(id, txId, message) {
    return this.accounts.setNote(id, txId, message);
  }
  start() {
    return this.synchronization.start();
  }
  setActive(active) {
    return this.synchronization.setActive(active);
  }
  refreshAll() {
    return this.synchronization.refreshAll();
  }
  scanVerified(wallet, client, previous, progress, alive) {
    return this.synchronization.scanVerified(
      wallet,
      client,
      previous,
      progress,
      alive,
    );
  }
  connection(id) {
    return this.synchronization.connection(id);
  }
  refresh(id, options) {
    return this.synchronization.refresh(id, options);
  }
  refreshMarket() {
    return this.marketData.refreshMarket();
  }
  applyRates(batch) {
    return this.marketData.applyRates(batch);
  }
  refreshRates(currency) {
    return this.marketData.refreshRates(currency);
  }
  updateMarket() {
    return this.marketData.updateMarket();
  }
  refreshChart(currency, range, options) {
    return this.marketData.refreshChart(currency, range, options);
  }
  refreshMarketDetails() {
    return this.marketData.refreshMarketDetails();
  }
  updateFees() {
    return this.marketData.updateFees();
  }
  preference(key, value) {
    return this.settings.preference(key, value);
  }
  recoveryMaterial(id) {
    return this.recovery.recoveryMaterial(id);
  }
  reveal(id) {
    return this.recovery.reveal(id);
  }
  signMessage(id, item, address, message) {
    return this.messages.sign(id, item, address, message);
  }
  addressPrivateKey(id, address) {
    return this.recovery.addressPrivateKey(id, address);
  }
  receive(id, type, chain, rotate) {
    return this.addresses.receive(id, type, chain, rotate);
  }
  prepare(id, draft) {
    return this.paymentCoordinator.prepare(id, draft);
  }
  replacementOptions(id, txid) {
    return this.paymentCoordinator.replacementOptions(id, txid);
  }
  prepareReplacement(id, txid, options) {
    return this.paymentCoordinator.prepareReplacement(id, txid, options);
  }
  preview(id, draft) {
    return this.paymentCoordinator.preview(id, draft);
  }
  send(planId) {
    return this.paymentCoordinator.send(planId);
  }
  retryPending(txid) {
    return this.paymentCoordinator.retryPending(txid);
  }
  hasPasscode() {
    return this.security.hasPasscode();
  }
  passcodeLockout() {
    return this.security.lockout();
  }
  tickPasscodeLockout(elapsed) {
    return this.security.tickLockout(elapsed);
  }
  setPasscode(code) {
    return this.security.setPasscode(code);
  }
  verifyPasscode(code) {
    return this.security.verifyPasscode(code);
  }
  clearPasscodeAttempts() {
    return this.security.clearAttempts();
  }
  removePasscode() {
    return this.security.removePasscode();
  }
  setFaceId(enabled, domainState) {
    return this.security.setFaceId(enabled, domainState);
  }
  biometry() {
    return this.security.biometry();
  }
  authenticateFaceId(reason) {
    return this.security.authenticateFaceId(reason);
  }
}
