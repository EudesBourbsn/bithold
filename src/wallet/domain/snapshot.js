export const PREPARATION_SNAPSHOT_MAX_AGE_MS = 30000;
export function freshPreparationSnapshot(snapshot, now = Date.now()) {
  return (
    !!snapshot &&
    Number.isFinite(snapshot.updated) &&
    snapshot.updated <= now &&
    now - snapshot.updated <= PREPARATION_SNAPSHOT_MAX_AGE_MS &&
    Array.isArray(snapshot.coins) &&
    !!snapshot.raw &&
    typeof snapshot.raw === 'object' &&
    Number.isSafeInteger(snapshot.tip) &&
    snapshot.tip >= 0
  );
}
