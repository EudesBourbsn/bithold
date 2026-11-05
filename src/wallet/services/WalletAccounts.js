import { t } from '../../i18n/core.js';
import { isValidAvatarPhoto } from '../domain/avatarPhoto.js';
import { createMaterial, importMaterial } from '../domain/keys.js';

export class WalletAccounts {
  constructor(engine) {
    this.engine = engine;
  }
  // A created wallet starts not backed up; an imported one was entered from
  // its words, so it is.
  async add(
    input,
    options = {},
    { synchronize = false, backedUp = true, restoredMetadata } = {},
  ) {
    const engine = this.engine;
    if (!engine.ready) {
      throw new Error(t('error.accounts.walletStorageNotReady'));
    }
    // Bithold is mainnet only; a test network wallet (an older iCloud
    // backup) is refused.
    const network = options.network ?? 'Mainnet';
    if (network !== 'Mainnet') {
      throw new Error(t('error.accounts.invalidRecoveryMaterialImportOptions'));
    }
    let imported;
    try {
      imported = importMaterial(input, { ...options, network });
    } catch {
      throw new Error(t('error.accounts.invalidRecoveryMaterialImportOptions'));
    }
    if (
      engine.state.wallets.some(w => w.identity === imported.wallet.identity)
    ) {
      throw new Error(t('error.accounts.walletAlreadyImported'));
    }
    const id = await engine.native.randomBytes(16);
    const wallet = {
      ...imported.wallet,
      id,
      name: t('wallet.defaultName', {
        number: engine.state.wallets.length + 1,
      }),
      color: '#D9BC82',
      icon: 'wallet',
      created: Date.now(),
      backedUp,
    };
    // The cloud recovery parser verifies these fields against re-derived
    // keys before calling add. Apply them before the first persisted state
    // and before scanning, so address discovery keeps its original bounds.
    if (restoredMetadata) {
      if (
        restoredMetadata.identity !== wallet.identity ||
        (restoredMetadata.icon === 'profile_photo'
          ? !isValidAvatarPhoto(restoredMetadata.avatarPhoto)
          : restoredMetadata.avatarPhoto != null)
      ) {
        throw new Error(
          t('error.accounts.invalidRecoveryMaterialImportOptions'),
        );
      }
      for (const key of ['name', 'color', 'icon', 'standard', 'exposed']) {
        wallet[key] = restoredMetadata[key];
      }
      if (restoredMetadata.icon === 'profile_photo') {
        wallet.avatarPhoto = restoredMetadata.avatarPhoto;
      }
    }
    let snapshot;
    const generation = engine.generation;
    const alive = () => engine.active && generation === engine.generation;
    try {
      if (synchronize) {
        const client = engine.connection(id);
        [snapshot] = await Promise.all([
          engine.scanVerified(wallet, client, undefined, () => {}, alive),
          engine.refreshRates().catch(() => {}),
          engine
            .refreshChart(engine.state.preferences.currency)
            .catch(() => {}),
        ]);
        if (!snapshot || !alive()) {
          throw new Error(t('error.accounts.importWasInterruptedPleaseTry'));
        }
        if (engine.state.wallets.some(w => w.identity === wallet.identity)) {
          throw new Error(t('error.accounts.walletAlreadyImported'));
        }
        await engine.native.storageSet(
          engine.key(`snapshot:${id}`),
          JSON.stringify(snapshot),
        );
      }
      if (imported.secret) {
        await engine.native.storageSet(
          engine.key(`secret:${id}`),
          JSON.stringify(imported.secret),
        );
      }
      if (synchronize && !alive()) {
        throw new Error(t('error.accounts.importWasInterruptedPleaseTry'));
      }
      const before = engine.state;
      engine.state = {
        ...engine.state,
        wallets: [...engine.state.wallets, wallet],
        selectedId: id,
      };
      try {
        await engine.save();
      } catch (error) {
        engine.state = before;
        throw error;
      }
      if (snapshot) {
        engine.snapshots.set(id, snapshot);
        engine.status.set(id, {
          phase: 'connected',
          peer: engine.clients.get(id)?.peer,
          updated: snapshot.updated,
        });
      }
    } catch (error) {
      const client = engine.clients.get(id);
      engine.clients.delete(id);
      await client?.close().catch(() => {});
      await engine.native
        .storageRemove(engine.key(`secret:${id}`))
        .catch(() => {});
      await engine.native
        .storageRemove(engine.key(`snapshot:${id}`))
        .catch(() => {});
      throw error;
    }
    engine.emit();
    if (!snapshot) {
      engine.refresh(id).catch(() => {});
    }
    return id;
  }
  async create({ synchronize = false } = {}) {
    const engine = this.engine;
    return engine.add(
      createMaterial(await engine.native.randomBytes(16)),
      { network: engine.electrum.chain() },
      {
        synchronize,
        backedUp: false,
      },
    );
  }
  async markBackedUp(id) {
    const engine = this.engine;
    if (engine.wallet(id).backedUp === true) {
      return;
    }
    engine.state.wallets = engine.state.wallets.map(w =>
      w.id === id ? { ...w, backedUp: true } : w,
    );
    await engine.save();
    engine.emit();
  }
  async markRecoveryOnboardingSeen(id) {
    const engine = this.engine;
    const wallet = engine.wallet(id);
    if (wallet.recoveryOnboardingSeen) {
      return;
    }
    engine.state.wallets = engine.state.wallets.map(w =>
      w.id === id
        ? {
            ...w,
            recoveryOnboardingSeen: true,
          }
        : w,
    );
    await engine.save();
    engine.emit();
  }
  async update(id, changes) {
    const engine = this.engine;
    const allowed = Object.fromEntries(
      Object.entries(changes).filter(([key]) =>
        ['name', 'color', 'icon', 'standard', 'avatarPhoto'].includes(key),
      ),
    );
    if (
      allowed.name != null &&
      (!allowed.name.trim() || allowed.name.length > 80)
    ) {
      throw new Error(t('error.accounts.enterWalletName180'));
    }
    const wallet = engine.wallet(id);
    const hasIcon = Object.hasOwn(allowed, 'icon');
    const hasPhoto = Object.hasOwn(allowed, 'avatarPhoto');
    const icon = hasIcon ? allowed.icon : wallet.icon;
    if (icon === 'profile_photo') {
      const photo = hasPhoto ? allowed.avatarPhoto : wallet.avatarPhoto;
      if (!isValidAvatarPhoto(photo)) {
        throw Object.assign(new Error(t('error.operationFailed')), {
          code: 'wallet.invalidAvatarPhoto',
        });
      }
    } else if (hasIcon || hasPhoto) {
      allowed.avatarPhoto = null;
    }
    if (
      allowed.standard &&
      !wallet.accounts.some(a => a.type === allowed.standard)
    ) {
      throw new Error(t('error.accounts.addressTypeUnavailable'));
    }
    engine.state.wallets = engine.state.wallets.map(w =>
      w.id === id
        ? {
            ...w,
            ...allowed,
          }
        : w,
    );
    engine.previewCache.delete(id);
    await engine.save();
    engine.emit();
  }
  wallet(id) {
    const engine = this.engine;
    const value = engine.state.wallets.find(w => w.id === id);
    if (!value) {
      throw new Error(t('error.accounts.walletNoLongerExists'));
    }
    return value;
  }
  async select(id) {
    const engine = this.engine;
    engine.wallet(id);
    engine.state.selectedId = id;
    await engine.save();
    engine.emit();
    engine.refresh(id).catch(() => {});
  }
  async remove(id, { force = false } = {}) {
    const engine = this.engine;
    engine.wallet(id);
    if (
      !force &&
      engine.state.pending.some(p => p.walletId === id && !p.accepted)
    ) {
      throw new Error(t('error.accounts.walletHasUnresolvedBroadcastCheck'));
    }
    const client = engine.clients.get(id);
    engine.clients.delete(id);
    await client?.close();
    engine.snapshots.delete(id);
    engine.status.delete(id);
    engine.previewCache.delete(id);
    engine.state.wallets = engine.state.wallets.filter(w => w.id !== id);
    engine.state.pending = engine.state.pending.filter(p => p.walletId !== id);
    const { [id]: _removedNotes, ...notes } = engine.state.notes ?? {};
    engine.state.notes = notes;
    if (engine.state.selectedId === id) {
      engine.state.selectedId =
        engine.state.wallets.find(w => engine.onChain(w))?.id ?? null;
    }
    await engine.save();
    await engine.native.storageRemove(engine.key(`secret:${id}`));
    await engine.native.storageRemove(engine.key(`snapshot:${id}`));
    engine.emit();
    // The passcode belongs to the wallets: the last one takes it along.
    if (!engine.state.wallets.length) {
      await this.removeLock();
    }
    return engine.state.wallets.length;
  }

  async setNote(id, txId, message) {
    const engine = this.engine;
    engine.wallet(id);
    if (typeof txId !== 'string' || !/^[0-9a-f]{64}$/i.test(txId)) {
      throw new Error(t('error.accounts.invalidTransaction'));
    }
    if (typeof message !== 'string') {
      throw new Error(t('error.accounts.invalidNote'));
    }
    const { [txId]: _previous, ...walletNotes } =
      engine.state.notes?.[id] ?? {};
    engine.state.notes = {
      ...engine.state.notes,
      [id]: message ? { ...walletNotes, [txId]: message } : walletNotes,
    };
    await engine.save();
    engine.emit();
  }
  // force: also removes wallets with an unresolved broadcast (the "Forgot
  // passcode" erase, where nothing else can be done with them).
  async clear({ force = false } = {}) {
    const engine = this.engine;
    for (const wallet of [...engine.state.wallets]) {
      await engine.remove(wallet.id, { force });
    }
    await this.removeLock();
  }
  // A reset leaves no lock behind: the passcode belongs to the wallets.
  async removeLock() {
    const engine = this.engine;
    if (engine.state.security || engine.state.preferences.faceId) {
      await engine.security.removePasscode();
    }
  }
}
