import { t } from '../../i18n/core.js';
import { btc, bytesToHex, hexToBytes, networkFor } from './keys.js';
import {
  feeCalculator,
  inputFor,
  inputShape,
  outpoint,
  paymentCandidates,
  signedVsize,
} from './paymentPlan.js';

export const INCREMENTAL_RELAY_FEERATE = 1;
const DUST = 546;

function ownRows(snapshot) {
  return new Map(snapshot.addresses.map(row => [row.script, row]));
}

export function replacementOptions(wallet, snapshot, txid) {
  const tx = snapshot?.transactions.find(item => item.id === txid);
  const unavailable = reason => ({ cancel: false, speedUp: false, reason });
  if (!tx || tx.confirmations > 0 || tx.height > 0) {
    return unavailable(t('replace.reason.confirmed'));
  }
  if (wallet.watchOnly) {
    return unavailable(t('replace.reason.watchOnly'));
  }
  if (tx.direction === 'received') {
    return unavailable(t('replace.reason.received'));
  }
  const rows = ownRows(snapshot);
  if (!tx.inputs.length || tx.inputs.some(input => !rows.has(input.script))) {
    return unavailable(t('replace.reason.foreignInputs'));
  }
  const spentLater = snapshot.transactions.some(
    other =>
      other.id !== txid &&
      !(other.confirmations > 0) &&
      other.inputs.some(input => input.outpoint.startsWith(`${txid}:`)),
  );
  if (spentLater) {
    return unavailable(t('replace.reason.spentLater'));
  }
  if (tx.inputs.some(input => !snapshot.raw[input.outpoint.split(':')[0]])) {
    return unavailable(t('replace.reason.refresh'));
  }
  return { cancel: true, speedUp: true, reason: null };
}

function originalCoins(snapshot, tx) {
  const rows = ownRows(snapshot);
  return tx.inputs.map(input => {
    const [txid, index] = input.outpoint.split(':');
    const {
      coins: _coins,
      history: _history,
      balance: _balance,
      ...row
    } = rows.get(input.script);
    return {
      ...row,
      txid,
      indexInTx: Number(index),
      value: input.value,
      height: 0,
      coinbase: false,
    };
  });
}

export function replacementFee(original, vsize, feeRate) {
  return Math.max(
    feeCalculator(feeRate)(vsize),
    original.fee + Math.ceil(INCREMENTAL_RELAY_FEERATE * vsize),
    Math.floor((original.fee * vsize) / original.vsize) + 1,
  );
}

export function minimumReplacementRate(original) {
  const rate =
    (original.fee + INCREMENTAL_RELAY_FEERATE * original.vsize) /
    original.vsize;
  return Math.ceil(rate * 1000) / 1000;
}

export function prepareReplacement(
  wallet,
  snapshot,
  txid,
  { mode, feeRate },
  destination,
) {
  const options = replacementOptions(wallet, snapshot, txid);
  if (!options.cancel) {
    throw new Error(options.reason);
  }
  if (!['cancel', 'speedUp'].includes(mode)) {
    throw new Error(t('error.replacement.unknownReplacement'));
  }
  if (!Number.isFinite(feeRate) || feeRate < 1 || feeRate > 1000) {
    throw new Error(t('error.payment.chooseFeeRate11000'));
  }
  if (!snapshot || Date.now() - snapshot.updated > 120000) {
    throw new Error(t('error.replacement.refreshWalletBeforeReplacingPayment'));
  }
  const tx = snapshot.transactions.find(item => item.id === txid);
  const original = { fee: tx.fee, vsize: tx.vsize };
  const net = networkFor(wallet.network);
  const coins = originalCoins(snapshot, tx);
  const parents = new Map();
  const shapes = coins.map(coin =>
    inputShape(coin, inputFor(coin, snapshot, true, parents)),
  );
  const total = coins.reduce((sum, coin) => sum + coin.value, 0);
  const destinationScript = bytesToHex(
    btc.OutScript.encode(btc.Address(net).decode(destination.address)),
  );
  let outputs;
  let selected = coins;
  let change = null;
  let fee;
  let vsize;
  if (mode === 'cancel') {
    vsize = signedVsize(shapes, [hexToBytes(destinationScript)]);
    fee = replacementFee(original, vsize, feeRate);
    if (total - fee < DUST) {
      throw new Error(t('error.replacement.paymentTooSmallCancelFee'));
    }
    outputs = [{ script: destinationScript, amount: total - fee }];
    change = destination;
  } else {
    const rows = ownRows(snapshot);

    const owned = tx.outputs
      .map((output, index) => ({ ...output, index }))
      .filter(output => rows.has(output.script));
    const payer =
      owned.find(output => rows.get(output.script).chain === 1) ??
      (owned.length === tx.outputs.length ? owned.at(-1) : owned[0]);
    const kept = tx.outputs.map(output => ({
      script: output.script,
      amount: output.value,
    }));
    if (payer) {
      vsize = signedVsize(
        shapes,
        kept.map(o => hexToBytes(o.script)),
      );
      fee = replacementFee(original, vsize, feeRate);
      const reduced = payer.value - (fee - original.fee);
      if (reduced >= DUST) {
        outputs = kept.map((output, index) =>
          index === payer.index ? { ...output, amount: reduced } : output,
        );
      }
    }
    if (!outputs) {
      const recipients = kept.filter(
        (output, index) => !payer || index !== payer.index,
      );
      const used = new Set(coins.map(outpoint));
      const extra = paymentCandidates(snapshot, true, used, parents)
        .filter(
          candidate => candidate.coin.height > 0 && !candidate.coin.coinbase,
        )
        .sort(
          (a, b) =>
            b.coin.value - a.coin.value ||
            outpoint(a.coin).localeCompare(outpoint(b.coin)),
        );
      const spend = [...coins];
      const spendShapes = [...shapes];
      let available = total;
      const recipientTotal = recipients.reduce((sum, o) => sum + o.amount, 0);
      for (const candidate of extra) {
        spend.push(candidate.coin);
        spendShapes.push(candidate.shape);
        available += candidate.coin.value;
        const scripts = [
          ...recipients.map(o => hexToBytes(o.script)),
          hexToBytes(destinationScript),
        ];
        vsize = signedVsize(spendShapes, scripts);
        fee = replacementFee(original, vsize, feeRate);
        const rest = available - recipientTotal - fee;
        if (rest >= DUST) {
          outputs = [
            ...recipients,
            { script: destinationScript, amount: rest },
          ];
          selected = spend;
          change = destination;
          break;
        }
      }
      if (!outputs) {
        throw new Error(t('error.replacement.notEnoughConfirmedBitcoinRaise'));
      }
    }
  }
  const transaction = new btc.Transaction({
    version: 2,
    lockTime: snapshot.tip,
  });
  selected.forEach(coin =>
    transaction.addInput(inputFor(coin, snapshot, true)),
  );
  outputs.forEach(output =>
    transaction.addOutput({
      script: hexToBytes(output.script),
      amount: BigInt(output.amount),
    }),
  );
  if (Number(transaction.fee) !== fee) {
    throw new Error(t('error.replacement.replacementAccountingMismatch'));
  }
  if (fee <= original.fee || fee / vsize <= original.fee / original.vsize) {
    throw new Error(t('error.replacement.replacementFeeNotHigherThan'));
  }
  return {
    mode,
    replaces: txid,
    coins: selected,
    outputs,
    feeRate,
    rbf: true,
    networkFeeSatoshis: fee,
    estimatedVsize: vsize,
    originalFee: original.fee,
    returned: mode === 'cancel' ? outputs[0].amount : 0,
    change,
    walletId: wallet.id,
    network: wallet.network,
    created: Date.now(),
    psbt: bytesToHex(transaction.toPSBT()),
  };
}
