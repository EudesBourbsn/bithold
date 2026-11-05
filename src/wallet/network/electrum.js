import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes, utf8ToBytes } from '@noble/hashes/utils.js';
import { t } from '../../i18n/core.js';

export const MAINNET_PEERS = [
  ['e.keff.org', 50002],
  ['electrum.petrkr.net', 50002],
  ['f.keff.org', 50002],
  ['fulcrum.grey.pw', 51002],
  ['e2.keff.org', 50002],
  ['caleb.vegas', 50002],
  ['blockstream.info', 700],
  ['electrum.blockstream.info', 50002],
];
const GENESIS =
  '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';
const CHECKPOINT =
  '0000000000000000000590fc0f3eba193a278534220b2b37e9849e1a770ca959';
// What a server of each network must prove (genesis hash, and for mainnet a
// checkpoint header and a minimum tip). Testnet accepts testnet4 and the
// older testnet3; the variant is reported so explorer links match.
export const CHAINS = {
  Mainnet: {
    genesis: { [GENESIS]: 'mainnet' },
    checkpoint: [700000, CHECKPOINT],
    minTip: 700000,
  },
  testnet: {
    genesis: {
      '00000000da84f2bafbbc53dee25a72ae507ff4914b867c565be350b0da8bf043':
        'testnet4',
      '000000000933ea01ad0ee984209779baaec3ced90fa3f408719526f8d77f4943':
        'testnet3',
    },
    minTip: 0,
  },
  signet: {
    genesis: {
      '00000008819873e925422c1ff0f99f7cc9bbb232af63a077a480a3633bee1ef6':
        'signet',
    },
    minTip: 0,
  },
  regtest: {
    genesis: {
      '0f9188f13cb7b2c71f2a335e3a4fc328bf5beb436012afca590b1a11466e2206':
        'regtest',
    },
    minTip: 0,
  },
};
export const historyStatus = history =>
  history.length
    ? bytesToHex(
        sha256(
          utf8ToBytes(
            history.map(tx => `${tx.tx_hash}:${tx.height}:`).join(''),
          ),
        ),
      )
    : null;
export const hash256 = bytes => bytesToHex(sha256(sha256(bytes)).reverse());
export async function mapLimit(values, limit, fn) {
  let next = 0,
    failure;
  const output = new Array(values.length);
  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, async () => {
      while (!failure && next < values.length) {
        const index = next++;
        try {
          output[index] = await fn(values[index], index, () => !failure);
        } catch (error) {
          failure ??= error;
        }
      }
    }),
  );

  if (failure) {
    throw failure;
  }
  return output;
}
export function chunks(values, size) {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, i) =>
    values.slice(i * size, (i + 1) * size),
  );
}
// A peer is { host, port, tls, pin, trustUnknown }: pin is the SHA-256 of the
// certificate trusted for that server, trustUnknown lets a first connection
// accept a self-signed certificate. The built-in list stays [host, port]
// pairs: TLS with the system's trust only.
export function peerOf(value) {
  if (Array.isArray(value)) {
    return {
      host: value[0],
      port: value[1],
      tls: true,
      pin: null,
      trustUnknown: false,
    };
  }
  return { tls: true, pin: null, trustUnknown: false, ...value };
}
export function supportsBatching(software) {
  const name = String(software ?? '');
  if (name.startsWith('ElectrumPersonalServer')) {
    return false;
  }
  const electrs = name.match(/^electrs\/?\s*v?(\d+)\.(\d+)/i);
  if (electrs) {
    return Number(electrs[1]) > 0 || Number(electrs[2]) >= 9;
  }
  const fulcrum = name.match(/^Fulcrum\s+v?(\d+)\.(\d+)/i);
  if (fulcrum) {
    return (
      Number(fulcrum[1]) > 1 ||
      (Number(fulcrum[1]) === 1 && Number(fulcrum[2]) >= 9)
    );
  }
  return true;
}
const tagged = (code, message) => Object.assign(new Error(message), { code });

export class Electrum {
  constructor(transport, events, peers = MAINNET_PEERS, chain = 'Mainnet') {
    this.transport = transport;
    this.chain = CHAINS[chain] ? chain : 'Mainnet';
    this.peers = peers.map(peerOf);
    this.session = null;
    this.connecting = null;
    this.counter = 0;
    this.cursor = 0;
    this.closed = false;
    this.metrics = [];
    this.tail = Promise.resolve();
    this.scripts = new Set();
    this.listeners = new Set();
    this.batching = true;
    this.peer = null;
    this.removeListener = events?.(event => {
      if (event.session !== this.session) {
        return;
      }
      if (event.message.method === 'disconnected') {
        this.session = null;
        this.scripts.clear();
      }
      for (const listener of this.listeners) {
        listener(event.message);
      }
    });
  }
  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  record(entry) {
    if (this.metrics.length >= 50) {
      this.metrics.shift();
    }
    this.metrics.push(entry);
  }
  async wire(session, calls, timeout = 4) {
    // Servers that do not answer JSON-RPC batches (Electrum Personal Server,
    // old electrs and Fulcrum) get one request per line, in order.
    if (this.batching === false && calls.length > 1) {
      const results = [];
      for (const call of calls) {
        results.push((await this.wire(session, [call], timeout))[0]);
      }
      return results;
    }
    const requests = calls.map(([method, params = []]) => ({
      jsonrpc: '2.0',
      id: ++this.counter,
      method,
      params,
    }));
    const response = JSON.parse(
      await this.transport.exchange(session, JSON.stringify(requests), timeout),
    );
    if (!Array.isArray(response) || response.length !== requests.length) {
      throw new Error(t('error.electrum.incompleteElectrumResponse'));
    }
    const byId = new Map(response.map(item => [item.id, item]));
    if (byId.size !== requests.length) {
      throw new Error(t('error.electrum.duplicateElectrumResponse'));
    }
    return requests.map(request => {
      const result = byId.get(request.id);
      if (!result || result.error || !Object.hasOwn(result, 'result')) {
        throw new Error(
          t('error.electrum.rejected', { method: request.method }),
        );
      }
      return result.result;
    });
  }
  // Opens one peer and proves it is a Bitcoin mainnet server speaking
  // Electrum 1.4: genesis hash and the header at 700000 must match.
  async probe(peer) {
    let session;
    const began = Date.now();
    try {
      const opened = await this.transport.connect(peer.host, peer.port, {
        tls: peer.tls,
        pin: peer.pin ?? null,
        trustUnknown: !!peer.trustUnknown,
      });
      session = typeof opened === 'string' ? opened : opened.session;
      // server.version goes alone: every server answers a single request,
      // and its reply says whether batches may follow.
      const [version] = await this.wire(
        session,
        [['server.version', ['Bithold/1.0', '1.4']]],
        6,
      );
      if (!Array.isArray(version) || !String(version[1]).startsWith('1.4')) {
        throw tagged(
          'protocol',
          t('error.electrum.serverFailedBitcoinMainnetVerification'),
        );
      }
      this.batching = supportsBatching(version[0]);
      // The server must be on this client's network: its genesis hash, and
      // on mainnet the header at the checkpoint height.
      const params = CHAINS[this.chain];
      const calls = [['server.features']];
      if (params.checkpoint) {
        calls.push(['blockchain.block.header', [params.checkpoint[0]]]);
      }
      const [features, header] = await this.wire(session, calls, 6);
      const variant = params.genesis[features?.genesis_hash];
      if (
        !variant ||
        (params.checkpoint &&
          (!/^[\da-f]{160}$/i.test(header) ||
            hash256(hexToBytes(header)) !== params.checkpoint[1]))
      ) {
        throw tagged(
          'chain',
          t('error.electrum.serverFailedBitcoinMainnetVerification'),
        );
      }
      this.record({
        host: peer.host,
        milliseconds: Date.now() - began,
        qualified: true,
      });
      return {
        session,
        variant,
        software: String(version[0] ?? ''),
        fingerprint:
          typeof opened === 'object' ? opened.fingerprint ?? null : null,
        trusted: typeof opened === 'object' ? opened.trusted !== false : true,
      };
    } catch (error) {
      this.record({
        host: peer.host,
        milliseconds: Date.now() - began,
        qualified: false,
        error: error.message,
      });
      if (session) {
        await this.transport.close(session).catch(() => {});
      }
      throw error;
    }
  }
  async open() {
    if (this.closed) {
      throw new Error(t('error.electrum.walletConnectionClosed'));
    }
    if (this.session) {
      return this.session;
    }
    if (this.connecting) {
      return this.connecting;
    }
    this.connecting = (async () => {
      let last = null;
      if (!this.peers.length) {
        throw tagged('noServer', t('electrum.chooseServer'));
      }
      // Three rounds of two over the built-in servers.
      for (let round = 0; round < 3; round++) {
        if (this.closed) {
          throw new Error(t('error.electrum.walletConnectionClosed'));
        }
        let winner = null;
        const probes = Array.from(
          { length: Math.min(2, this.peers.length) },
          async () => {
            const peer = this.peers[this.cursor++ % this.peers.length];
            const result = await this.probe(peer);
            if (winner || this.closed) {
              await this.transport.close(result.session).catch(() => {});
              throw tagged(
                'superseded',
                t('error.electrum.connectionSuperseded'),
              );
            }
            winner = result.session;
            this.peer = peer.host;
            this.connected = peer;
            return result.session;
          },
        );
        try {
          const session = await Promise.any(probes);
          if (this.closed) {
            await this.transport.close(session).catch(() => {});
            throw new Error(t('error.electrum.walletConnectionClosed'));
          }
          this.session = session;
          this.scripts.clear();
          return this.session;
        } catch (failure) {
          if (!failure.errors) {
            throw failure;
          }
          last =
            failure.errors.find(error => error.code !== 'superseded') ??
            failure.errors[0] ??
            last;
          // Nothing a retry can change.
          if (['certificate', 'chain', 'protocol'].includes(last?.code)) {
            break;
          }
        }
      }
      throw tagged(
        'unreachable',
        t('error.electrum.unableConnectBitcoinServersCheck'),
      );
    })();
    try {
      return await this.connecting;
    } finally {
      this.connecting = null;
    }
  }
  call(calls) {
    const execute = async () => {
      const session = await this.open();
      try {
        return await this.wire(session, calls);
      } catch (error) {
        if (this.session === session) {
          this.session = null;
          this.scripts.clear();
        }
        await this.transport.close(session).catch(() => {});
        throw error;
      }
    };
    const task = this.tail.then(execute);
    this.tail = task.catch(() => {});
    return task;
  }
  async tip() {
    const [tip] = await this.call([['blockchain.headers.subscribe']]);
    if (
      !Number.isSafeInteger(tip?.height) ||
      tip.height < CHAINS[this.chain].minTip ||
      !/^[\da-f]{160}$/i.test(tip.hex)
    ) {
      throw new Error(t('error.electrum.invalidChainTip'));
    }
    return {
      height: tip.height,
      hash: hash256(hexToBytes(tip.hex)),
      header: tip.hex,
    };
  }
  async subscribe(hashes, expectedStatuses) {
    const missing = hashes.filter(hash => !this.scripts.has(hash));
    for (const group of chunks(missing, 100)) {
      const result = await this.call(
        group.map(hash => ['blockchain.scripthash.subscribe', [hash]]),
      );
      if (result.some(v => v !== null && !/^[a-f\d]{64}$/.test(v))) {
        throw new Error(t('error.electrum.invalidSubscriptionStatus'));
      }

      if (
        expectedStatuses &&
        group.some((hash, i) => result[i] !== expectedStatuses.get(hash))
      ) {
        throw new Error(
          t('error.electrum.addressHistoryChangedDuringSynchronization'),
        );
      }
      group.forEach(hash => this.scripts.add(hash));
    }
  }
  async scriptsState(hashes) {
    const rows = [];
    for (const group of chunks(hashes, 33)) {
      const values = await this.call(
        group.flatMap(hash =>
          ['get_balance', 'get_history', 'listunspent'].map(method => [
            `blockchain.scripthash.${method}`,
            [hash],
          ]),
        ),
      );
      for (let i = 0; i < group.length; i++) {
        rows.push({
          balance: values[i * 3],
          history: values[i * 3 + 1],
          coins: values[i * 3 + 2],
        });
      }
    }
    return rows;
  }
  async transactions(ids) {
    const result = {};
    for (const group of chunks([...new Set(ids)], 20)) {
      const data = await this.call(
        group.map(id => ['blockchain.transaction.get', [id, false]]),
      );
      group.forEach((id, i) => {
        result[id] = data[i];
      });
    }
    return result;
  }
  async headers(heights) {
    const result = {};
    for (const group of chunks([...new Set(heights.filter(h => h > 0))], 50)) {
      const data = await this.call(
        group.map(height => ['blockchain.block.header', [height]]),
      );
      group.forEach((height, i) => {
        if (!/^[\da-f]{160}$/i.test(data[i])) {
          throw new Error(t('error.electrum.invalidBlockHeader'));
        }
        result[height] = data[i];
      });
    }
    return result;
  }
  async reconnect() {
    const session = this.session;
    this.session = null;
    this.scripts.clear();
    if (session) {
      await this.transport.close(session).catch(() => {});
    }
  }
  async close() {
    this.closed = true;
    this.removeListener?.();
    this.listeners.clear();
    const session = this.session;
    this.session = null;
    this.scripts.clear();
    if (session) {
      await this.transport.close(session);
    }
  }
}
