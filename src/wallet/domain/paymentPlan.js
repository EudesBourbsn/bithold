import { secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { signECDSA } from '@scure/btc-signer/utils.js';
import { t } from '../../i18n/core.js';
import { decodeVerified } from '../synchronization/scanWallet.js';
import {
  btc,
  bytesToHex,
  hexToBytes,
  networkFor,
  privateKeysFor,
} from './keys.js';

export const outpoint = coin => `${coin.txid}:${coin.indexInTx}`;
export function inputFor(coin, snapshot, rbf = true, parents) {
  const raw = snapshot.raw[coin.txid];
  let cached = parents?.get(coin.txid);
  if (!cached || cached.raw !== raw) {
    cached = {
      raw,
      parent: decodeVerified(raw, coin.txid),
      bytes: hexToBytes(raw),
    };
    parents?.set(coin.txid, cached);
  }
  const parent = cached.parent;
  if (coin.indexInTx >= parent.outputsLength) {
    throw new Error(t('error.payment.missingSpendingOutput'));
  }
  const output = parent.getOutput(coin.indexInTx);
  if (
    Number(output.amount) !== coin.value ||
    bytesToHex(output.script) !== coin.script
  ) {
    throw new Error(t('error.payment.spendingOutputChanged'));
  }
  const input = {
    txid: coin.txid,
    index: coin.indexInTx,
    sequence: rbf ? 0xfffffffd : 0xfffffffe,
    nonWitnessUtxo: cached.bytes,
    witnessUtxo: { script: output.script, amount: output.amount },
  };
  for (const field of ['redeemScript', 'witnessScript', 'tapInternalKey']) {
    if (coin[field]) {
      input[field] = hexToBytes(coin[field]);
    }
  }
  return input;
}

export function inputShape(coin, input) {
  const probe = new btc.Transaction();
  probe.addInput(input);
  const normalized = probe.getInput(0),
    type = btc.getInputType(normalized);
  const outpointInput = {
    txid: normalized.txid,
    index: normalized.index,
    sequence: normalized.sequence,
  };
  const signature = () => new Uint8Array(72);
  let stack;
  if (type.txType === 'taproot') {
    if (!normalized.tapInternalKey || normalized.tapLeafScript) {
      throw new Error(t('error.payment.unsupportedTaprootSpendPath'));
    }
    return {
      input: { ...outpointInput, finalScriptSig: new Uint8Array() },
      witness: [new Uint8Array(64)],
    };
  }
  if (type.last.type === 'pkh') {
    stack = [signature(), new Uint8Array(coin.uncompressed ? 65 : 33)];
  } else if (type.last.type === 'wpkh') {
    stack = [signature(), new Uint8Array(33)];
  } else if (type.last.type === 'pk') {
    stack = [signature()];
  } else if (type.last.type === 'ms') {
    stack = [
      new Uint8Array(),
      ...Array.from({ length: type.last.m }, signature),
    ];
  } else {
    throw new Error(t('error.payment.unsupportedInputScriptFeeEstimation'));
  }
  let witness = [],
    script = new Uint8Array();
  if (type.txType === 'segwit') {
    witness = type.type.includes('wsh-') ? [...stack, type.lastScript] : stack;
    if (type.type.startsWith('sh-')) {
      script = btc.Script.encode([normalized.redeemScript]);
    }
  } else {
    script = btc.Script.encode(
      type.type.startsWith('sh-') ? [...stack, type.lastScript] : stack,
    );
  }
  return { input: { ...outpointInput, finalScriptSig: script }, witness };
}
export function signedVsize(shapes, scripts) {
  const transaction = {
    version: 2,
    lockTime: 0,
    inputs: shapes.map(s => s.input),
    outputs: scripts.map(script => ({ amount: 0n, script })),
    segwitFlag: false,
  };
  const stripped = btc.RawTx.encode(transaction).length;
  const witness = shapes.some(s => s.witness.length);
  const total = witness
    ? btc.RawTx.encode({
        ...transaction,
        segwitFlag: true,
        witnesses: shapes.map(s => s.witness),
      }).length
    : stripped;
  return Math.ceil((stripped * 3 + total) / 4);
}
export function feeCalculator(feeRate) {
  const parts = String(feeRate).split('.');
  if ((parts[1]?.length ?? 0) > 3) {
    throw new Error(t('error.payment.useMostThreeDecimalPlaces'));
  }
  const milliRate =
    BigInt(parts[0]) * 1000n + BigInt((parts[1] ?? '').padEnd(3, '0'));
  return vsize => Number((BigInt(vsize) * milliRate + 999n) / 1000n);
}
function calculatePayment(
  wallet,
  snapshot,
  { address, satoshis, feeRate, sendMax = false, rbf = true },
  change,
  getCandidates,
) {
  if (wallet.watchOnly) {
    throw new Error(t('error.payment.watchOnlyWalletCannotSign'));
  }
  if (!snapshot || Date.now() - snapshot.updated > 120000) {
    throw new Error(t('error.payment.refreshWalletBeforeSending'));
  }
  if (!Number.isFinite(feeRate) || feeRate < 1 || feeRate > 1000) {
    throw new Error(t('error.payment.chooseFeeRate11000'));
  }
  if (typeof rbf !== 'boolean') {
    throw new Error(t('error.payment.invalidRbfPreference'));
  }
  const net = networkFor(wallet.network);
  const recipient = btc.OutScript.encode(btc.Address(net).decode(address));
  if (
    !sendMax &&
    (!Number.isSafeInteger(satoshis) ||
      satoshis < 546 ||
      satoshis > 2100000000000000)
  ) {
    throw new Error(t('error.payment.enterLeast546Satoshis'));
  }
  const feeFor = feeCalculator(feeRate);
  const changeScript = btc.OutScript.encode(
    btc.Address(net).decode(change.address),
  );
  const candidates = getCandidates(rbf)
    .map(candidate => ({
      ...candidate,
      effective: candidate.coin.value - feeFor(candidate.inputVsize),
    }))
    .filter(c => c.effective > 0)
    .sort(
      (a, b) =>
        b.effective - a.effective ||
        outpoint(a.coin).localeCompare(outpoint(b.coin)),
    );
  const selected = [];
  let sum = 0,
    fee,
    vsize,
    changeValue = 0;
  for (const candidate of candidates) {
    selected.push(candidate);
    sum += candidate.coin.value;
    if (sendMax && selected.length !== candidates.length) {
      continue;
    }
    const shapes = selected.map(c => c.shape);
    const withoutChange = signedVsize(shapes, [recipient]);
    const minimum = feeFor(withoutChange);
    if (sendMax) {
      vsize = withoutChange;
      fee = minimum;
      satoshis = sum - fee;
      break;
    }
    if (sum < satoshis + minimum) {
      continue;
    }
    const withChange = signedVsize(shapes, [recipient, changeScript]);
    const changeFee = feeFor(withChange);
    if (sum - satoshis - changeFee >= 546) {
      vsize = withChange;
      fee = changeFee;
      changeValue = sum - satoshis - fee;
    } else {
      vsize = withoutChange;
      fee = sum - satoshis;
    }
    break;
  }
  if (fee == null) {
    throw Object.assign(
      new Error(t('error.payment.insufficientBalanceAmountNetworkFee')),
      { code: 'insufficient' },
    );
  }
  const selectedCoins = selected.map(c => c.coin);
  if (
    satoshis < 546 ||
    fee < 0 ||
    changeValue < 0 ||
    (changeValue > 0 && changeValue < 546)
  ) {
    throw Object.assign(
      new Error(t('error.payment.amountBelowBitcoinDustLimit')),
      { code: 'dust' },
    );
  }
  return {
    coins: selectedCoins,
    address,
    satoshis,
    feeRate,
    rbf,
    networkFeeSatoshis: fee,
    change: changeValue ? change : null,
    changeSatoshis: changeValue,
    estimatedVsize: vsize,
    walletId: wallet.id,
    created: Date.now(),
    network: wallet.network,
  };
}
export function paymentCandidates(
  snapshot,
  rbf,
  reserved = new Set(),
  parents,
) {
  const coins = snapshot.coins.filter(
    c =>
      !reserved.has(outpoint(c)) &&
      (!c.coinbase || (c.height > 0 && snapshot.tip - c.height + 1 >= 100)),
  );
  if (!coins.length) {
    throw new Error(t('error.payment.noSpendableBitcoinAvailable'));
  }
  if (new Set(coins.map(outpoint)).size !== coins.length) {
    throw new Error(t('error.payment.duplicateSpendingOutput'));
  }
  return coins.map(coin => {
    const shape = inputShape(coin, inputFor(coin, snapshot, rbf, parents));
    const base =
      40 +
      btc.CompactSize.encode(BigInt(shape.input.finalScriptSig.length)).length +
      shape.input.finalScriptSig.length;
    const inputVsize = Math.ceil(
      (base * 4 +
        (shape.witness.length
          ? btc.RawWitness.encode(shape.witness).length
          : 0)) /
        4,
    );
    return { coin, shape, inputVsize };
  });
}
export function createPaymentPreview(wallet, snapshot, change) {
  if (!snapshot || Date.now() - snapshot.updated > 120000) {
    throw new Error(t('error.payment.refreshWalletBeforeSending'));
  }
  const parents = new Map();
  const candidates = paymentCandidates(snapshot, true, new Set(), parents);
  const coinsKey = JSON.stringify(snapshot.coins),
    updated = snapshot.updated,
    tip = snapshot.tip;
  const network = wallet.network,
    walletId = wallet.id;

  return draft => {
    if (
      wallet.network !== network ||
      wallet.id !== walletId ||
      snapshot.updated !== updated ||
      snapshot.tip !== tip ||
      JSON.stringify(snapshot.coins) !== coinsKey ||
      [...parents].some(([id, parent]) => snapshot.raw[id] !== parent.raw)
    ) {
      throw new Error(t('error.payment.walletSnapshotChangedRefreshFee'));
    }
    const result = calculatePayment(
      wallet,
      snapshot,
      draft,
      change,
      () => candidates,
    );
    const { created: _created, change: _change, ...preview } = result;
    return preview;
  };
}
export function preparePayment(
  wallet,
  snapshot,
  draft,
  change,
  reserved = new Set(),
) {
  const plan = calculatePayment(wallet, snapshot, draft, change, rbf =>
    paymentCandidates(snapshot, rbf, reserved),
  );
  const {
    coins: selectedCoins,
    address,
    satoshis,
    rbf,
    networkFeeSatoshis: fee,
    changeSatoshis: changeValue,
  } = plan;
  const net = networkFor(wallet.network),
    recipient = btc.OutScript.encode(btc.Address(net).decode(address));
  const tx = new btc.Transaction({ version: 2, lockTime: snapshot.tip });
  selectedCoins.forEach(c => tx.addInput(inputFor(c, snapshot, rbf)));
  tx.addOutput({ script: recipient, amount: BigInt(satoshis) });
  if (changeValue) {
    tx.addOutputAddress(change.address, BigInt(changeValue), net);
  }
  if (Number(tx.fee) !== fee) {
    throw new Error(t('error.payment.paymentAccountingMismatch'));
  }
  return { ...plan, psbt: bytesToHex(tx.toPSBT()) };
}
export function signPayment(plan, secret, auxiliaryRandom) {
  if (auxiliaryRandom.length !== 32) {
    throw new Error(t('error.payment.secureSigningRandomnessUnavailable'));
  }
  const tx = btc.Transaction.fromPSBT(hexToBytes(plan.psbt));
  for (let i = 0; i < tx.inputsLength; i++) {
    if (
      tx.getInput(i).sequence !== (plan.rbf === false ? 0xfffffffe : 0xfffffffd)
    ) {
      throw new Error(t('error.payment.transactionRbfSettingDoesNot'));
    }
  }
  for (let index = 0; index < plan.coins.length; index++) {
    const keys = privateKeysFor(secret, plan.coins[index], plan.network);
    try {
      let signed = false;
      for (const key of keys) {
        const pub = secp256k1.getPublicKey(key, false);
        if (
          plan.coins[index].uncompressedPublicKeys?.includes(bytesToHex(pub))
        ) {
          const script = hexToBytes(
            plan.coins[index].redeemScript ?? plan.coins[index].script,
          );

          const raw = btc.RawTx.decode(tx.unsignedTx);
          raw.inputs.forEach((input, i) => {
            input.finalScriptSig = i === index ? script : new Uint8Array();
          });
          const encoded = btc.RawTx.encode(raw);
          const preimage = new Uint8Array(encoded.length + 4);
          preimage.set(encoded);
          preimage[encoded.length] = 1;
          const signature = signECDSA(sha256(sha256(preimage)), key);
          const signatureWithType = new Uint8Array(signature.length + 1);
          signatureWithType.set(signature);
          signatureWithType[signature.length] = 1;
          tx.updateInput(index, { partialSig: [[pub, signatureWithType]] });
          signed = true;
        } else {
          signed = tx.signIdx(key, index, undefined, auxiliaryRandom) || signed;
        }
      }
      if (!signed) {
        throw new Error(t('error.payment.recoveryMaterialCannotSignInput'));
      }
      tx.finalizeIdx(index);
    } finally {
      keys.forEach(key => key.fill(0));
    }
  }
  const raw = tx.extract();

  const outputsMatch = plan.outputs
    ? tx.outputsLength === plan.outputs.length &&
      plan.outputs.every((output, i) => {
        const signedOutput = tx.getOutput(i);
        return (
          Number(signedOutput.amount) === output.amount &&
          bytesToHex(signedOutput.script) === output.script
        );
      })
    : Number(tx.getOutput(0).amount) === plan.satoshis &&
      bytesToHex(tx.getOutput(0).script) ===
        bytesToHex(
          btc.OutScript.encode(
            btc.Address(networkFor(plan.network)).decode(plan.address),
          ),
        );
  if (Number(tx.fee) !== plan.networkFeeSatoshis || !outputsMatch) {
    throw new Error(t('error.payment.signedPaymentDoesNotMatch'));
  }
  if (plan.networkFeeSatoshis < feeCalculator(plan.feeRate)(tx.vsize)) {
    throw new Error(t('error.payment.signedTransactionExceedsReviewedFee'));
  }
  return {
    raw: bytesToHex(raw),
    txid: tx.id,
    vsize: tx.vsize,
    fee: plan.networkFeeSatoshis,
  };
}
export async function fetchJSON(url, fetcher = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetcher(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(
        t('error.payment.serviceUnavailable', { status: response.status }),
      );
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
// The public broadcast services of each network (testnet means testnet4
// unless the server in use is a testnet3 one; regtest has none).
export function broadcastProviders(network = 'Mainnet', variant) {
  switch (network) {
    case 'testnet':
      return variant === 'testnet3'
        ? [
            'https://mempool.space/testnet/api',
            'https://blockstream.info/testnet/api',
          ]
        : ['https://mempool.space/testnet4/api'];
    case 'signet':
      return ['https://mempool.space/signet/api'];
    case 'regtest':
      return [];
    default:
      return ['https://mempool.space/api', 'https://blockstream.info/api'];
  }
}
export async function broadcastRaw(
  signed,
  fetcher = fetch,
  { network = 'Mainnet', variant, viaElectrum } = {},
) {
  const raw = signed.raw,
    txid = signed.txid;
  // On test networks the wallet's own Electrum server is asked first.
  if (network !== 'Mainnet' && viaElectrum) {
    try {
      if ((await viaElectrum(raw)) === txid) {
        return txid;
      }
    } catch {}
  }
  const providers = broadcastProviders(network, variant);
  const uncertain = [];
  const request = async (url, options) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetcher(url, {
        ...options,
        signal: controller.signal,
      });
      return {
        ok: response.ok,
        text: (await response.text()).trim().toLowerCase(),
      };
    } finally {
      clearTimeout(timer);
    }
  };
  for (const provider of providers) {
    try {
      const response = await request(`${provider}/tx`, {
        method: 'POST',
        body: raw,
        headers: { 'Content-Type': 'text/plain', Accept: 'text/plain' },
      });
      if (response.ok) {
        if (response.text === txid) {
          return txid;
        }

        continue;
      }
      uncertain.push(provider);
    } catch {
      uncertain.push(provider);
    }
  }

  for (const provider of uncertain.reverse()) {
    try {
      const response = await request(`${provider}/tx/${txid}/hex`, {
        headers: { Accept: 'text/plain' },
      });
      if (response.ok && response.text === raw.toLowerCase()) {
        return txid;
      }
    } catch {}
  }
  throw new Error(t('error.payment.broadcastResultUncertainSignedPayment'));
}
