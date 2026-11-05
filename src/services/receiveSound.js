export function createReceiveSoundListener(play) {
  const heard = new Map();
  return event => {
    if (event.kind !== 'received' || event.satoshis <= 0 || !event.walletId) {
      return;
    }
    const known = heard.get(event.walletId) ?? new Set();
    const fresh = event.txids.filter(id => id && !known.has(id));
    if (!fresh.length) {
      return;
    }
    fresh.forEach(id => known.add(id));
    heard.set(event.walletId, known);
    play('receive');
  };
}
