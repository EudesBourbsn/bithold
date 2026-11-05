import { t } from '../../i18n/core.js';
import { deriveAddress, hexToBytes } from '../domain/keys.js';
import {
  createPaymentPreview,
  preparePayment,
  signPayment,
  broadcastRaw,
  outpoint,
} from '../domain/paymentPlan.js';
import {
  minimumReplacementRate,
  prepareReplacement,
  replacementOptions,
} from '../domain/replacement.js';
import { freshPreparationSnapshot } from '../domain/snapshot.js';

export class WalletPayments {
  constructor(engine) {
    this.engine = engine;
  }
  // Where a payment of this wallet is broadcast: its network's services,
  // and on test networks first the wallet's own Electrum server.
  broadcastOptions(walletId) {
    const engine = this.engine;
    const network = engine.wallet(walletId).network ?? 'Mainnet';
    return {
      network,
      variant: engine.state.electrum?.variants?.[network],
      viaElectrum: async raw => {
        // Only a client of the wallet's own network may carry it; otherwise
        // the network's public services below do.
        if (!engine.onChain(engine.wallet(walletId))) {
          throw new Error(t('error.electrum.connectionSuperseded'));
        }
        const client = engine.connection(walletId);
        if (client.chain !== network) {
          throw new Error(t('error.electrum.connectionSuperseded'));
        }
        const [txid] = await client.call([
          ['blockchain.transaction.broadcast', [raw]],
        ]);
        return txid;
      },
    };
  }
  async prepare(id, draft) {
    const engine = this.engine;
    engine.wallet(id);
    if (!engine.active) {
      throw new Error(t('error.payment.walletNotSynchronized'));
    }
    if (engine.state.pending.some(p => p.walletId === id && !p.accepted)) {
      throw new Error(
        t('error.payment.previousBroadcastUnresolvedRefreshRetry'),
      );
    }
    const cached = engine.snapshots.get(id);
    const snapshot = freshPreparationSnapshot(cached)
      ? cached
      : await engine.refresh(id);
    if (!snapshot) {
      throw new Error(t('error.payment.walletNotSynchronized'));
    }
    const wallet = engine.wallet(id);
    const change = await engine.receive(
      id,
      wallet.standard,
      wallet.fixed || wallet.chains?.length === 1 ? 0 : 1,
    );
    const plan = preparePayment(wallet, snapshot, draft, change);
    const planId = await engine.native.randomBytes(16);
    plan.id = planId;
    engine.plans.set(planId, plan);
    return {
      ...draft,
      satoshis: plan.satoshis,
      networkFeeSatoshis: plan.networkFeeSatoshis,
      feeRate: plan.feeRate,
      rbf: plan.rbf,
      planId,
      walletId: id,
    };
  }

  replacementOptions(id, txid) {
    const engine = this.engine;
    const snapshot = engine.snapshots.get(id);
    const options = replacementOptions(engine.wallet(id), snapshot, txid);
    const tx = snapshot?.transactions.find(item => item.id === txid);
    return {
      ...options,
      minimumRate: tx ? minimumReplacementRate(tx) : null,
      originalRate: tx ? tx.fee / tx.vsize : null,
    };
  }
  async prepareReplacement(id, txid, { mode, feeRate }) {
    const engine = this.engine;
    engine.wallet(id);
    if (!engine.active) {
      throw new Error(t('error.payment.walletNotSynchronized'));
    }
    if (engine.state.pending.some(p => p.walletId === id && !p.accepted)) {
      throw new Error(
        t('error.payment.previousBroadcastUnresolvedRefreshRetry'),
      );
    }
    const cached = engine.snapshots.get(id);
    const snapshot = freshPreparationSnapshot(cached)
      ? cached
      : await engine.refresh(id);
    if (!snapshot) {
      throw new Error(t('error.payment.walletNotSynchronized'));
    }
    const wallet = engine.wallet(id);

    const destination = await engine.receive(
      id,
      wallet.standard,
      wallet.fixed || wallet.chains?.length === 1 ? 0 : 1,
    );
    const plan = prepareReplacement(
      wallet,
      snapshot,
      txid,
      { mode, feeRate },
      destination,
    );
    const planId = await engine.native.randomBytes(16);
    plan.id = planId;
    engine.plans.set(planId, plan);
    return {
      planId,
      mode,
      replaces: txid,
      feeRate: plan.feeRate,
      networkFeeSatoshis: plan.networkFeeSatoshis,
      originalFee: plan.originalFee,
      returned: plan.returned,
      estimatedVsize: plan.estimatedVsize,
      walletId: id,
    };
  }
  preview(id, draft) {
    const engine = this.engine;
    const wallet = engine.wallet(id);
    const snapshot = engine.snapshots.get(id);
    const chain = wallet.fixed || wallet.chains?.length === 1 ? 0 : 1;
    let cached = engine.previewCache.get(id);
    if (
      !cached ||
      cached.snapshot !== snapshot ||
      cached.wallet !== wallet ||
      cached.standard !== wallet.standard ||
      cached.chain !== chain
    ) {
      cached = {
        wallet,
        snapshot,
        standard: wallet.standard,
        chain,
        calculate: createPaymentPreview(
          wallet,
          snapshot,
          deriveAddress(wallet, wallet.standard, chain, 0, { verify: true }),
        ),
      };
      engine.previewCache.set(id, cached);
    }
    return cached.calculate(draft);
  }
  async send(planId) {
    const engine = this.engine;
    if (engine.signing) {
      throw new Error(t('error.payment.paymentAlreadyBeingSubmitted'));
    }
    const plan = engine.plans.get(planId);
    if (
      !plan ||
      Date.now() - plan.created > 120000 ||
      plan.walletId !== engine.state.selectedId
    ) {
      throw new Error(t('error.payment.paymentReviewExpiredSelectedWallet'));
    }
    const assertReview = () => {
      if (
        engine.plans.get(planId) !== plan ||
        plan.walletId !== engine.state.selectedId ||
        Date.now() - plan.created > 120000
      ) {
        throw new Error(t('error.payment.paymentReviewExpiredSelectedWallet'));
      }
    };
    let createdPending = null,
      broadcastStarted = false;
    engine.signing = true;
    try {
      assertReview();
      engine.wallet(plan.walletId);
      let signed = engine.state.pending.find(p => p.planId === planId);
      if (!signed) {
        const snapshot = await engine.refresh(plan.walletId, {
          force: true,
        });
        assertReview();

        const original = plan.replaces
          ? snapshot?.transactions.find(item => item.id === plan.replaces)
          : null;
        const originalInputs = new Set(
          original?.inputs.map(input => input.outpoint),
        );
        if (
          plan.replaces &&
          (!original ||
            original.confirmations > 0 ||
            original.height > 0 ||
            plan.coins
              .filter(c => originalInputs.has(outpoint(c)))
              .some(c => {
                const input = original.inputs.find(
                  i => i.outpoint === outpoint(c),
                );
                return input.value !== c.value || input.script !== c.script;
              }) ||
            original.inputs.some(
              input => !plan.coins.some(c => outpoint(c) === input.outpoint),
            ))
        ) {
          throw new Error(
            t('error.payment.paymentConfirmedChangedMeantimeNothing'),
          );
        }
        if (
          !snapshot ||
          plan.coins
            .filter(c => !originalInputs.has(outpoint(c)))
            .some(
              c =>
                !snapshot.coins.some(
                  live =>
                    outpoint(live) === outpoint(c) &&
                    live.value === c.value &&
                    live.script === c.script &&
                    (!plan.replaces || live.height > 0),
                ),
            )
        ) {
          throw new Error(t('error.payment.selectedCoinsChangedReviewPayment'));
        }
        const data = await engine.native.storageGet(
          engine.key(`secret:${plan.walletId}`),
        );
        if (!data) {
          throw new Error(t('error.payment.signingKeyUnavailable'));
        }
        const random = hexToBytes(await engine.native.randomBytes(32));
        try {
          assertReview();
          signed = signPayment(plan, JSON.parse(data), random);
        } finally {
          random.fill(0);
        }
        signed = {
          ...signed,
          walletId: plan.walletId,
          planId,
          replaces: plan.replaces ?? null,
          outpoints: plan.coins.map(outpoint),
          created: Date.now(),
          accepted: false,
        };
        createdPending = signed;
        engine.state.pending.push(signed);
        await engine.save();
        if (plan.change && !engine.wallet(plan.walletId).fixed) {
          await engine.receive(
            plan.walletId,
            plan.change.type,
            plan.change.chain,
            true,
          );
        }
      }
      if (!signed.accepted) {
        await engine.save();
        assertReview();
        broadcastStarted = true;
        await broadcastRaw(
          signed,
          engine.fetcher,
          this.broadcastOptions(plan.walletId),
        );
        signed.accepted = true;
        engine.security.noteSend();
        await engine.save();
      }
      engine.plans.delete(planId);
      engine.emit();
      engine
        .refresh(plan.walletId, {
          force: true,
        })
        .catch(() => {});
      return signed.txid;
    } catch (error) {
      if (
        createdPending &&
        !broadcastStarted &&
        engine.state.pending.includes(createdPending)
      ) {
        engine.state.pending = engine.state.pending.filter(
          p => p !== createdPending,
        );
        try {
          await engine.save();
          engine.emit();
        } catch {
          if (!engine.state.pending.some(p => p.txid === createdPending.txid)) {
            engine.state.pending.push(createdPending);
          }
        }
      }
      throw error;
    } finally {
      engine.signing = false;
    }
  }
  async retryPending(txid) {
    const engine = this.engine;
    const pending = engine.state.pending.find(
      p => p.txid === txid && !p.accepted,
    );
    if (!pending || engine.signing) {
      throw new Error(t('error.payment.noUnresolvedPaymentAvailable'));
    }
    engine.signing = true;
    try {
      await engine.refresh(pending.walletId, {
        force: true,
      });
      if (engine.state.pending.find(p => p.txid === txid)?.accepted) {
        return txid;
      }
      await engine.save();
      await broadcastRaw(
        pending,
        engine.fetcher,
        this.broadcastOptions(pending.walletId),
      );
      pending.accepted = true;
      engine.security.noteSend();
      await engine.save();
      engine.emit();
      return txid;
    } finally {
      engine.signing = false;
      engine
        .refresh(pending.walletId, {
          force: true,
        })
        .catch(() => {});
    }
  }
}
