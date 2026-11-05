import { t } from '../../i18n/core.js';
import { btc, bytesToHex, hexToBytes, deriveAddress } from '../domain/keys.js';
import { mapLimit, historyStatus } from '../network/electrum.js';

const MAX = 2100000000000000;

let sliceStart = 0;
let pendingYield = null;
const overBudget = () => Date.now() - sliceStart > 8;
const yieldToUI = () => {
  pendingYield ??= new Promise(resolve =>
    setTimeout(() => {
      pendingYield = null;
      sliceStart = Date.now();
      resolve();
    }, 0),
  );
  return pendingYield;
};
const isHash = value =>
  typeof value === 'string' && /^[a-f\d]{64}$/.test(value);
const isSats = value =>
  Number.isSafeInteger(value) && value >= 0 && value <= MAX;
const point = input => `${bytesToHex(input.txid)}:${input.index}`;
const coinbase = tx =>
  tx.inputsLength === 1 &&
  bytesToHex(tx.getInput(0).txid) === '0'.repeat(64) &&
  tx.getInput(0).index === 0xffffffff;
export function decodeVerified(hex, id) {
  if (
    typeof hex !== 'string' ||
    hex.length > 8000000 ||
    !/^(?:[a-f\d]{2})+$/i.test(hex)
  ) {
    throw new Error(t('error.sync.invalidRawTransaction'));
  }
  const tx = btc.Transaction.fromRaw(hexToBytes(hex), {
    allowUnknownOutputs: true,
    allowUnknownInputs: true,
  });
  if (tx.id !== id) {
    throw new Error(t('error.sync.transactionIdVerificationFailed'));
  }
  let total = 0;
  for (let i = 0; i < tx.outputsLength; i++) {
    total += Number(tx.getOutput(i).amount);
  }
  if (!isSats(total)) {
    throw new Error(t('error.sync.invalidTransactionValues'));
  }
  return tx;
}
function validateState(state, tip) {
  const { balance, history, coins } = state;
  if (
    !balance ||
    !isSats(balance.confirmed) ||
    !Number.isSafeInteger(balance.unconfirmed) ||
    !isSats(balance.confirmed + balance.unconfirmed) ||
    !Array.isArray(history) ||
    !Array.isArray(coins) ||
    history.length > 100000 ||
    coins.length > 100000
  ) {
    throw new Error(t('error.sync.invalidAddressState'));
  }
  const ids = new Map();
  for (const tx of history) {
    if (
      !isHash(tx.tx_hash) ||
      !Number.isSafeInteger(tx.height) ||
      tx.height < -1 ||
      tx.height > tip ||
      ids.has(tx.tx_hash)
    ) {
      throw new Error(t('error.sync.inconsistentTransactionHistory'));
    }
    ids.set(tx.tx_hash, tx.height);
  }
  let sum = 0;
  const points = new Set();
  for (const coin of coins) {
    const key = `${coin.tx_hash}:${coin.tx_pos}`;
    if (
      !isHash(coin.tx_hash) ||
      !Number.isInteger(coin.tx_pos) ||
      coin.tx_pos < 0 ||
      coin.tx_pos > 0xffffffff ||
      !isSats(coin.value) ||
      points.has(key) ||
      !ids.has(coin.tx_hash) ||
      !Number.isSafeInteger(coin.height) ||
      !(
        ids.get(coin.tx_hash) === coin.height ||
        (ids.get(coin.tx_hash) <= 0 && coin.height <= 0)
      )
    ) {
      throw new Error(t('error.sync.invalidUnspentOutput'));
    }
    points.add(key);
    sum += coin.value;
  }
  if (!isSats(sum) || sum !== balance.confirmed + balance.unconfirmed) {
    throw new Error(t('error.sync.balanceDoesNotMatchUnspent'));
  }
}
export async function scanWallet(
  wallet,
  client,
  previous,
  onProgress = () => {},
  alive = () => true,
) {
  const started = Date.now();
  const tip = await client.tip();
  const session = client.session;
  const branches = wallet.accounts.flatMap(account =>
    (wallet.fixed ? [0] : wallet.chains ?? [0, 1]).map(chain => ({
      ...account,
      chain,
    })),
  );
  const addresses = (
    await mapLimit(branches, 4, async (branch, _index, working) => {
      const result = [];
      let index = 0,
        unused = 0;
      const through = Math.max(
        wallet.exposed?.[`${branch.type}:${branch.chain}`] ?? -1,
        ...(previous?.addresses ?? [])
          .filter(
            row =>
              row.type === branch.type &&
              row.chain === branch.chain &&
              row.history.length,
          )
          .map(row => row.index),
        -1,
      );
      do {
        if (!alive() || !working()) {
          throw new Error(t('error.sync.walletScanCancelled'));
        }
        if (index >= 100000) {
          throw new Error(t('error.sync.addressDiscoveryLimitReachedLarger'));
        }

        const rows = [];
        for (let i = 0; i < (wallet.fixed ? 1 : 20); i++) {
          while (overBudget()) {
            await yieldToUI();
            if (!alive() || !working()) {
              throw new Error(t('error.sync.walletScanCancelled'));
            }
          }
          rows.push(
            deriveAddress(wallet, branch.type, branch.chain, index + i),
          );
        }
        const states = await client.scriptsState(
          rows.map(row => row.scriptHash),
        );
        if (!alive() || !working()) {
          throw new Error(t('error.sync.walletScanCancelled'));
        }
        for (let i = 0; i < rows.length; i++) {
          validateState(states[i], tip.height);
          unused = states[i].history.length ? 0 : unused + 1;
          result.push({ ...rows[i], ...states[i] });
        }
        index += rows.length;
        onProgress({ phase: 'addresses', count: index });

        await yieldToUI();
      } while (!wallet.fixed && (unused < 20 || index <= through + 20));
      return result;
    })
  ).flat();
  if (new Set(addresses.map(a => a.script)).size !== addresses.length) {
    throw new Error(t('error.sync.overlappingWalletDerivationBranches'));
  }
  const history = new Map();
  for (const row of addresses) {
    for (const entry of row.history) {
      if (
        history.has(entry.tx_hash) &&
        history.get(entry.tx_hash) !== entry.height
      ) {
        throw new Error(t('error.sync.historyChangedDuringSynchronization'));
      }
      history.set(entry.tx_hash, entry.height);
    }
  }
  onProgress({ phase: 'transactions', count: history.size });
  const raw = { ...previous?.raw };
  Object.assign(
    raw,
    await client.transactions([...history.keys()].filter(id => !raw[id])),
  );
  const parsed = new Map(
    [...history.keys()].map(id => [id, decodeVerified(raw[id], id)]),
  );
  const parentIDs = new Set();
  for (const tx of parsed.values()) {
    if (!coinbase(tx)) {
      for (let i = 0; i < tx.inputsLength; i++) {
        parentIDs.add(bytesToHex(tx.getInput(i).txid));
      }
    }
  }
  Object.assign(
    raw,
    await client.transactions([...parentIDs].filter(id => !raw[id])),
  );
  for (const id of parentIDs) {
    parsed.set(id, decodeVerified(raw[id], id));
  }
  const spent = new Set();
  const owned = new Set(addresses.map(row => row.script));
  const headers = await client.headers([...history.values()]);
  const transactions = [];
  for (const [id, height] of history) {
    const tx = parsed.get(id);
    let inputSum = 0,
      outputSum = 0,
      oursIn = 0,
      oursOut = 0;
    const inputs = [],
      outputs = [];
    if (!coinbase(tx)) {
      for (let i = 0; i < tx.inputsLength; i++) {
        const input = tx.getInput(i);
        const parent = parsed.get(bytesToHex(input.txid));
        if (!parent || input.index >= parent.outputsLength) {
          throw new Error(t('error.sync.missingInputTransaction'));
        }
        const output = parent.getOutput(input.index);
        const value = Number(output.amount),
          script = bytesToHex(output.script);
        inputSum += value;
        if (owned.has(script)) {
          oursIn += value;
        }
        spent.add(point(input));
        inputs.push({ outpoint: point(input), value, script });
      }
    }
    for (let i = 0; i < tx.outputsLength; i++) {
      const output = tx.getOutput(i);
      const value = Number(output.amount),
        script = bytesToHex(output.script);
      outputSum += value;
      if (owned.has(script)) {
        oursOut += value;
      }
      outputs.push({ value, script });
    }
    if (!isSats(inputSum) || (!coinbase(tx) && inputSum < outputSum)) {
      throw new Error(t('error.sync.invalidTransactionAccounting'));
    }
    const header = height > 0 ? hexToBytes(headers[height]) : null;
    const fee = coinbase(tx) ? 0 : inputSum - outputSum;
    const internal =
      oursIn > 0 &&
      inputs.every(i => owned.has(i.script)) &&
      outputs.every(o => owned.has(o.script));
    transactions.push({
      id,
      height,
      confirmations: height > 0 ? tip.height - height + 1 : 0,
      timestamp: header
        ? new DataView(header.buffer, header.byteOffset).getUint32(68, true) *
          1000
        : previous?.transactions?.find(item => item.id === id)?.timestamp ??
          started,
      delta: oursOut - oursIn,

      amount: internal
        ? fee
        : oursOut > oursIn
        ? oursOut - oursIn
        : Math.max(0, oursIn - oursOut - fee),
      direction: internal ? 'self' : oursOut > oursIn ? 'received' : 'sent',
      fee,
      vsize: tx.vsize,
      inputs,
      outputs,
    });
  }
  const coins = [];
  for (const row of addresses) {
    const expected = new Set();
    for (const entry of row.history) {
      const tx = transactions.find(item => item.id === entry.tx_hash);
      if (
        !tx.inputs.some(i => i.script === row.script) &&
        !tx.outputs.some(o => o.script === row.script)
      ) {
        throw new Error(t('error.sync.serverHistoryDoesNotBelong'));
      }
      tx.outputs.forEach((output, index) => {
        const key = `${tx.id}:${index}`;
        if (output.script === row.script && !spent.has(key)) {
          expected.add(key);
        }
      });
    }
    if (expected.size !== row.coins.length) {
      throw new Error(t('error.sync.serverOmittedAddedUnspentOutputs'));
    }
    for (const coin of row.coins) {
      const key = `${coin.tx_hash}:${coin.tx_pos}`,
        tx = parsed.get(coin.tx_hash);
      if (!expected.has(key) || coin.tx_pos >= tx.outputsLength) {
        throw new Error(t('error.sync.invalidUnspentOutput'));
      }
      const output = tx.getOutput(coin.tx_pos);
      if (
        Number(output.amount) !== coin.value ||
        bytesToHex(output.script) !== row.script
      ) {
        throw new Error(t('error.sync.outputValueOwnershipMismatch'));
      }
      coins.push({
        ...row,
        coins: undefined,
        history: undefined,
        balance: undefined,
        txid: coin.tx_hash,
        indexInTx: coin.tx_pos,
        value: coin.value,
        height: coin.height,
        coinbase: coinbase(tx),
      });
    }
  }
  const end = await client.tip();
  if (tip.hash !== end.hash || session !== client.session || !alive()) {
    throw new Error(t('error.sync.chainChangedDuringSynchronizationRefresh'));
  }
  const balance = coins.reduce((sum, coin) => sum + coin.value, 0);
  if (!isSats(balance)) {
    throw new Error(t('error.sync.invalidWalletBalance'));
  }
  await client.subscribe(
    addresses.map(row => row.scriptHash),
    new Map(addresses.map(row => [row.scriptHash, historyStatus(row.history)])),
  );
  if (session !== client.session || !alive()) {
    throw new Error(
      t('error.sync.connectionChangedDuringSynchronizationRefresh'),
    );
  }
  return {
    balance,
    addresses,
    coins,
    transactions: transactions.sort((a, b) => b.timestamp - a.timestamp),
    raw,
    tip: tip.height,
    tipHash: tip.hash,
    updated: Date.now(),
  };
}
