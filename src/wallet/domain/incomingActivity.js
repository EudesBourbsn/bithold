const RECENT = 48 * 60 * 60 * 1000;

export function incomingActivity(previous, next, now = Date.now()) {
  if (!previous || !next) {
    return [];
  }
  const known = new Set(previous.transactions.map(tx => tx.id));
  const incoming = next.transactions.filter(tx => {
    if (
      !tx.id ||
      known.has(tx.id) ||
      tx.direction !== 'received' ||
      !Number.isSafeInteger(tx.amount) ||
      tx.amount <= 0 ||
      !Number.isFinite(tx.timestamp) ||
      now - tx.timestamp > RECENT
    ) {
      return false;
    }
    known.add(tx.id);
    return true;
  });
  return incoming.length
    ? [
        {
          kind: 'received',
          satoshis: incoming.reduce((sum, tx) => sum + tx.amount, 0),
          txids: incoming.map(tx => tx.id),
        },
      ]
    : [];
}
