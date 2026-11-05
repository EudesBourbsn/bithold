import { importMaterial } from '../domain/keys.js';
import { isValidAvatarPhoto } from '../domain/avatarPhoto.js';

const invalid = () => {
  throw Object.assign(new Error('Invalid recovery backup'), {
    code: 'cloud.invalidPayload',
  });
};
const object = value =>
  value && typeof value === 'object' && !Array.isArray(value);

export function validateCloudPayload(value) {
  if (
    !object(value) ||
    value.version !== 1 ||
    value.type !== 'bithold.wallet'
  ) {
    invalid();
  }
  const { input, options, wallet } = value;
  if (
    typeof input !== 'string' ||
    !input.trim() ||
    input.length > 16384 ||
    !object(options) ||
    !object(wallet) ||
    // Bithold is mainnet only.
    options.network !== 'Mainnet' ||
    Object.keys(options).some(
      key =>
        !['network', 'passphrase', 'derivationPath', 'addressType'].includes(
          key,
        ),
    )
  ) {
    invalid();
  }
  for (const [key, max] of [
    ['passphrase', 16384],
    ['derivationPath', 256],
    ['addressType', 80],
  ]) {
    if (
      options[key] !== undefined &&
      (typeof options[key] !== 'string' || options[key].length > max)
    ) {
      invalid();
    }
  }
  let derived;
  try {
    derived = importMaterial(input, options).wallet;
  } catch {
    invalid();
  }
  if (
    derived.watchOnly ||
    derived.identity !== wallet.identity ||
    !derived.accounts.some(account => account.type === wallet.standard) ||
    typeof wallet.name !== 'string' ||
    !wallet.name.trim() ||
    wallet.name.length > 80 ||
    typeof wallet.color !== 'string' ||
    !/^#[a-f0-9]{6}$/i.test(wallet.color) ||
    typeof wallet.icon !== 'string' ||
    !/^[a-zA-Z0-9_-]{1,80}$/.test(wallet.icon) ||
    (wallet.icon === 'profile_photo'
      ? !isValidAvatarPhoto(wallet.avatarPhoto)
      : wallet.avatarPhoto != null) ||
    !object(wallet.exposed)
  ) {
    invalid();
  }
  const exposed = {};
  const branches = new Set(
    derived.accounts.flatMap(account =>
      (derived.fixed ? [0] : derived.chains ?? [0, 1]).map(
        chain => `${account.type}:${chain}`,
      ),
    ),
  );
  for (const [key, index] of Object.entries(wallet.exposed)) {
    if (
      !branches.has(key) ||
      !Number.isSafeInteger(index) ||
      index < 0 ||
      index >= 100000
    ) {
      invalid();
    }
    exposed[key] = index;
  }
  return {
    input,
    options: { ...options },
    wallet: {
      identity: derived.identity,
      name: wallet.name,
      color: wallet.color,
      icon: wallet.icon,
      ...(wallet.icon === 'profile_photo'
        ? { avatarPhoto: wallet.avatarPhoto }
        : {}),
      standard: wallet.standard,
      exposed,
    },
  };
}

export function createCloudPayload(wallet, secret, snapshot) {
  const exposed = { ...wallet.exposed };
  for (const row of snapshot?.addresses ?? []) {
    if (row.history?.length) {
      const key = `${row.type}:${row.chain}`;
      exposed[key] = Math.max(exposed[key] ?? 0, row.index);
    }
  }
  const value = {
    version: 1,
    type: 'bithold.wallet',
    input: secret.input,
    options: { ...secret.options, network: wallet.network },
    wallet: {
      identity: wallet.identity,
      name: wallet.name,
      color: wallet.color,
      icon: wallet.icon,
      ...(wallet.icon === 'profile_photo'
        ? { avatarPhoto: wallet.avatarPhoto }
        : {}),
      standard: wallet.standard,
      exposed,
    },
  };
  validateCloudPayload(value);
  return JSON.stringify(value);
}
