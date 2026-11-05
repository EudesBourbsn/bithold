export const BLOCK_EXPLORERS = [
  { id: 'mempool', name: 'Mempool.space', url: 'https://mempool.space' },
  {
    id: 'blockchair',
    name: 'Blockchair',
    url: 'https://blockchair.com/bitcoin',
    transactionPath: 'transaction',
    mainnetOnly: true,
  },
  {
    id: 'blockstream',
    name: 'Blockstream.info',
    url: 'https://blockstream.info',
  },
];
export const DEFAULT_BLOCK_EXPLORER = 'mempool';

const knownExplorer = id =>
  BLOCK_EXPLORERS.find(explorer => explorer.id === id);

export const normalizeExplorerUrl = url => url.trim().replace(/\/+$/, '');
export const validExplorerUrl = url =>
  /^https?:\/\/[^\s/?#]+(\/[^\s?#]*)?$/i.test(url);

export const validBlockExplorer = value =>
  !!knownExplorer(value) ||
  (typeof value === 'string' && validExplorerUrl(value));

export const isCustomExplorer = value => !knownExplorer(value);

// The explorer a link opens: the chosen one on mainnet. On a test network an
// explorer whose test network paths are known keeps them; Blockchair and a
// custom one give way to Mempool.space.
function linkExplorer(value, mainnet) {
  const known = knownExplorer(value);
  if (known && (mainnet || !known.mainnetOnly)) {
    return known;
  }
  if (!known && mainnet && validBlockExplorer(value)) {
    return { url: normalizeExplorerUrl(value) };
  }
  return knownExplorer(DEFAULT_BLOCK_EXPLORER);
}

export function explorerTransactionURL(value, mainnet, networkPath, id) {
  const explorer = linkExplorer(value, mainnet);
  return `${explorer.url}${networkPath}/${
    explorer.transactionPath ?? 'tx'
  }/${id}`;
}

export function explorerAddressURL(value, mainnet, networkPath, address) {
  return `${linkExplorer(value, mainnet).url}${networkPath}/address/${address}`;
}
