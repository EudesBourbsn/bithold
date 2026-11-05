import { incomingActivity } from '../domain/incomingActivity';

export class WalletSynchronization {
  constructor(engine) {
    this.engine = engine;
  }
  start() {
    const engine = this.engine;
    if (engine.timer || !engine.active || !engine.ready) {
      return;
    }
    engine.refreshMarket().catch(() => {});
    engine.refreshAll();

    engine.timer = setInterval(() => this.checkConnections(), 30000);
    engine.marketTimer = setInterval(
      () => engine.refreshMarket().catch(() => {}),
      60000,
    );
  }
  async setActive(active) {
    const engine = this.engine;
    engine.active = active;
    if (active) {
      engine.start();
      return;
    }
    engine.generation++;
    clearInterval(engine.timer);
    clearInterval(engine.marketTimer);
    engine.timer = null;
    for (const timer of engine.refreshTimers.values()) {
      clearTimeout(timer);
    }
    engine.refreshTimers.clear();
    const clients = [...engine.clients.values()];
    engine.clients.clear();
    engine.plans.clear();
    engine.jobs.clear();
    engine.refreshDirty.clear();
    engine.refreshPasses.clear();
    await Promise.all(clients.map(client => client.close().catch(() => {})));
  }
  refreshAll() {
    const engine = this.engine;
    engine.state.wallets
      .filter(w => engine.onChain(w))
      .forEach(w => engine.refresh(w.id).catch(() => {}));
  }

  checkConnections() {
    const engine = this.engine;
    for (const { id } of engine.state.wallets.filter(w => engine.onChain(w))) {
      if (engine.jobs.has(id)) {
        continue;
      }
      const client = engine.clients.get(id);
      const snapshot = engine.snapshots.get(id);
      const session = client?.session;
      if (!session || !snapshot) {
        engine.refresh(id).catch(() => {});
        continue;
      }
      client.tip().then(
        tip => {
          if (client.session !== session || tip.hash !== snapshot.tipHash) {
            engine.refresh(id).catch(() => {});
          }
        },
        () => engine.refresh(id).catch(() => {}),
      );
    }
  }
  async scanVerified(wallet, client, previous, progress, alive) {
    const engine = this.engine;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await engine.scanner(wallet, client, previous, progress, alive);
      } catch (error) {
        if (!alive() || attempt === 1 || !client.reconnect) {
          throw error;
        }
        await client.reconnect();
      }
    }
  }
  connection(id) {
    const engine = this.engine;
    if (engine.clients.has(id)) {
      return engine.clients.get(id);
    }
    const client = engine.clientFactory();
    engine.clients.set(id, client);
    client.onChange(() => {
      if (
        !engine.active ||
        engine.clients.get(id) !== client ||
        !engine.state.wallets.some(w => w.id === id)
      ) {
        return;
      }
      if (engine.jobs.has(id)) {
        engine.refreshDirty.add(id);
        return;
      }
      clearTimeout(engine.refreshTimers.get(id));
      engine.refreshTimers.set(
        id,
        setTimeout(() => {
          engine.refreshTimers.delete(id);
          engine.refresh(id).catch(() => {});
        }, 500),
      );
    });
    return client;
  }
  async refresh(id, { force = false } = {}) {
    const engine = this.engine;
    // A wallet of another network waits until its network is active.
    if (
      !engine.active ||
      !engine.onChain(engine.state.wallets.find(w => w.id === id))
    ) {
      return;
    }
    if (engine.jobs.has(id)) {
      const pending = engine.jobs.get(id);
      if (!force) {
        return pending;
      }
      engine.refreshDirty.add(id);
      const pass = engine.refreshPasses.get(id),
        requestedAfter = pass?.started;
      const generation = engine.generation;
      return pending.then(snapshot => {
        if (
          !engine.active ||
          engine.generation !== generation ||
          !engine.state.wallets.some(w => w.id === id)
        ) {
          return;
        }
        if (pass && pass.completed > requestedAfter) {
          return snapshot;
        }
        return engine.refresh(id);
      });
    }
    clearTimeout(engine.refreshTimers.get(id));
    engine.refreshTimers.delete(id);
    const wallet = engine.wallet(id),
      generation = engine.generation;
    const alive = () =>
      engine.active &&
      engine.generation === generation &&
      engine.state.wallets.some(w => w.id === id);
    const client = engine.connection(id);
    engine.status.set(id, {
      phase: 'connecting',
    });
    engine.emit();
    const pass = {
      started: 0,
      completed: 0,
    };
    engine.refreshPasses.set(id, pass);
    let task;
    task = (async () => {
      try {
        let snapshot;
        do {
          pass.started++;
          engine.refreshDirty.delete(id);
          snapshot = await engine.scanVerified(
            wallet,
            client,
            engine.snapshots.get(id),
            progress => {
              if (alive()) {
                engine.status.set(id, progress);
                engine.emit();
              }
            },
            alive,
          );
          if (!alive()) {
            return;
          }
          await engine.saveSnapshot(id, snapshot, alive);
          if (!alive()) {
            return;
          }
          const activity = incomingActivity(engine.snapshots.get(id), snapshot);
          engine.snapshots.set(id, snapshot);
          engine.previewCache.delete(id);
          for (const event of activity) {
            engine.emitActivity({ walletId: id, ...event });
          }
          let changed = false;
          engine.state.pending = engine.state.pending.map(p => {
            if (
              !p.accepted &&
              p.walletId === id &&
              snapshot.transactions.some(t => t.id === p.txid)
            ) {
              changed = true;
              return {
                ...p,
                accepted: true,
              };
            }
            return p;
          });
          // The server that answered is tried first next time.
          if (
            client.peer &&
            client.chain === 'Mainnet' &&
            client.peers.length > 1 &&
            engine.state.preferredPeers?.[0] !== client.peer
          ) {
            engine.state.preferredPeers = [
              client.peer,
              ...(engine.state.preferredPeers ?? []).filter(
                p => p !== client.peer,
              ),
            ].slice(0, 4);
            changed = true;
          }
          if (changed) {
            await engine.save();
          }
          if (!alive()) {
            return;
          }
          pass.completed = pass.started;
          engine.status.set(id, {
            phase: 'connected',
            peer: client.peer,
            updated: snapshot.updated,
          });
          engine.emit();
        } while (alive() && engine.refreshDirty.has(id) && pass.started < 3);
        return snapshot;
      } catch (error) {
        if (alive()) {
          engine.status.set(id, {
            phase: 'error',
            error: error.message,
            code: error.code,
          });
          engine.emit();
        }
        throw error;
      } finally {
        if (engine.jobs.get(id) === task) {
          const dirty = engine.refreshDirty.has(id);
          engine.jobs.delete(id);
          engine.refreshDirty.delete(id);
          engine.refreshPasses.delete(id);
          if (dirty && alive()) {
            clearTimeout(engine.refreshTimers.get(id));
            engine.refreshTimers.set(
              id,
              setTimeout(() => {
                engine.refreshTimers.delete(id);
                engine.refresh(id).catch(() => {});
              }, 500),
            );
          }
        }
      }
    })();
    engine.jobs.set(id, task);
    return task;
  }
}
