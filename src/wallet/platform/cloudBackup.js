import { NativeModules } from 'react-native';
import {
  createCloudPayload,
  validateCloudPayload,
} from '../services/cloudBackupPayload';

const fail = code => {
  throw Object.assign(new Error(code), { code });
};
const native = () =>
  NativeModules.BitholdCloudBackup ?? fail('cloud.unsupported');
const check = engine => {
  if (!engine.ready || !engine.active) {
    fail('cloud.interrupted');
  }
};

export async function discardCloudBackup(preparation) {
  if (preparation?.token) {
    await native().discardPrepared(preparation.token);
  }
}

const walletIdentity = (engine, walletId) => {
  try {
    return engine.wallet(walletId).identity;
  } catch {
    fail('cloud.interrupted');
  }
};

const checkPreparation = (engine, walletId, preparation) => {
  check(engine);
  if (
    preparation.walletId !== walletId ||
    preparation.generation !== engine.generation ||
    walletIdentity(engine, walletId) !== preparation.identity
  ) {
    fail('cloud.interrupted');
  }
};

export async function prepareCloudBackup(engine, walletId) {
  check(engine);
  const wallet = engine.wallet(walletId);
  if (wallet.watchOnly) {
    fail('cloud.watchOnly');
  }
  const owner = {
    walletId,
    identity: wallet.identity,
    generation: engine.generation,
  };
  const token = await native().prepare();
  if (typeof token !== 'string' || !token) {
    fail('cloud.interrupted');
  }
  const preparation = Object.freeze({ ...owner, token });
  try {
    checkPreparation(engine, walletId, preparation);
    return preparation;
  } catch (error) {
    await discardCloudBackup(preparation).catch(() => {});
    throw error;
  }
}

export async function saveCloudBackup(
  engine,
  walletId,
  { prepared = null } = {},
) {
  check(engine);
  if (prepared) {
    checkPreparation(engine, walletId, prepared);
  }
  const generation = engine.generation;
  const wallet = engine.wallet(walletId);
  if (wallet.watchOnly) {
    fail('cloud.watchOnly');
  }
  const raw = await engine.native.storageGet(engine.key(`secret:${walletId}`));
  check(engine);
  if (
    !raw ||
    generation !== engine.generation ||
    walletIdentity(engine, walletId) !== wallet.identity
  ) {
    fail('cloud.interrupted');
  }
  if (prepared) {
    checkPreparation(engine, walletId, prepared);
  }
  const payload = createCloudPayload(
    wallet,
    JSON.parse(raw),
    engine.snapshots.get(walletId),
  );
  const result = await (prepared
    ? native().upload(payload, prepared.token)
    : native().save(payload));
  check(engine);
  if (
    !result?.verified ||
    generation !== engine.generation ||
    walletIdentity(engine, walletId) !== wallet.identity
  ) {
    fail('cloud.interrupted');
  }
  const before = engine.state;
  engine.state = {
    ...before,
    wallets: before.wallets.map(item =>
      item.id === walletId
        ? {
            ...item,
            backedUp: true,
            cloudBackup: { id: result.id, verifiedAt: Date.now() },
          }
        : item,
    ),
  };
  try {
    await engine.save();
  } catch (error) {
    engine.state = before;
    throw error;
  }
  engine.emit();
  return result;
}

export const listCloudBackups = () => native().list();

export async function readCloudBackup(id) {
  const raw = await native().restore(id);
  if (typeof raw !== 'string' || raw.length > 1048576) {
    fail('cloud.invalidPayload');
  }
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    fail('cloud.invalidPayload');
  }
  return validateCloudPayload(payload);
}

export async function importCloudBackup(engine, payload) {
  check(engine);
  if (
    engine.state.wallets.some(
      wallet => wallet.identity === payload.wallet.identity,
    )
  ) {
    fail('cloud.duplicate');
  }
  const id = await engine.add(payload.input, payload.options, {
    backedUp: true,
    restoredMetadata: payload.wallet,
  });
  // The wallet is that backup's from now on (the restore picker marks it
  // Active). The wallet itself is already added and saved, so a failed
  // write here only leaves it unmarked.
  if (payload.backupId) {
    const before = engine.state;
    engine.state = {
      ...before,
      wallets: before.wallets.map(item =>
        item.id === id
          ? {
              ...item,
              cloudBackup: { id: payload.backupId, verifiedAt: Date.now() },
            }
          : item,
      ),
    };
    try {
      await engine.save();
    } catch {
      engine.state = before;
    }
    engine.emit();
  }
  return id;
}
