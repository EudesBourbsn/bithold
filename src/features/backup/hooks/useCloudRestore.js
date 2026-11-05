import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useT } from '../../../i18n/index';
import {
  importCloudBackup,
  listCloudBackups,
  readCloudBackup,
} from '../../../wallet/platform/cloudBackup';

const MESSAGES = [
  'unsupported',
  'prfUnsupported',
  'accountUnavailable',
  'accountChanged',
  'quotaExceeded',
  'network',
  'invalidPayload',
  'interrupted',
  'busy',
];

const codeOf = error => String(error?.code ?? '').replace(/^cloud\./, '');

export function useCloudRestore({ visible = true, onRestored } = {}) {
  const { engine } = useWallets();
  const t = useT();
  const [sheet, setSheet] = useState({ open: false, key: 0, step: 'picker' });
  const [checking, setChecking] = useState(false);
  const [entries, setEntries] = useState([]);
  const [picking, setPicking] = useState(null);
  const [payload, setPayload] = useState(null);
  const [message, setMessage] = useState(null);
  // The flow has a sheet up, or will again (a sheet swiped away while the
  // wallet is being added comes back with the result).
  const [engaged, setEngaged] = useState(false);
  const importing = useRef(false);
  const running = useRef(false);
  const alive = useRef(true);
  // The sheet this flow belongs to (Manage wallets, Import with) is still up.
  const shown = useRef(visible);
  shown.current = visible;
  // Set once a wallet was restored: closing the sheet then closes Manage
  // wallets too.
  const notifyDone = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const current = () => alive.current && shown.current;
  // Closing the sheet underneath ends the flow and drops what it read.
  useEffect(() => {
    if (!visible) {
      setSheet(previous =>
        previous.open ? { ...previous, open: false } : previous,
      );
      setPayload(null);
      setEngaged(false);
      notifyDone.current = false;
    }
  }, [visible]);
  const show = useCallback(step => {
    if (!alive.current || !shown.current) {
      return;
    }
    setEngaged(true);
    setSheet(previous => ({
      open: true,
      key: previous.open ? previous.key : previous.key + 1,
      step,
    }));
  }, []);
  const fail = useCallback(
    error => {
      const code = codeOf(error);
      if (code === 'cancelled') {
        return;
      }
      if (code === 'duplicate') {
        show('active');
      } else if (code === 'accountUnavailable') {
        show('access');
      } else if (code === 'prfUnsupported') {
        setMessage(t('cloudRestore.prfUnsupported'));
        show('passkeys');
      } else {
        setMessage(t(`cloud.${MESSAGES.includes(code) ? code : 'failed'}`));
        show('error');
      }
    },
    [show, t],
  );
  // The backups restored or saved here (each wallet keeps its backup's id).
  const inUse = () =>
    new Set(
      (engine.state.wallets ?? [])
        .map(wallet => wallet.cloudBackup?.id)
        .filter(Boolean),
    );
  // A backup: the system passkey prompt, then the preview to confirm.
  const pick = async entry => {
    if (picking) {
      return;
    }
    setPicking(entry.id);
    try {
      const restored = await readCloudBackup(entry.id);
      if (!current()) {
        return;
      }
      if (
        (engine.state.wallets ?? []).some(
          wallet => wallet.identity === restored.wallet.identity,
        )
      ) {
        show('active');
        return;
      }
      setPayload({ ...restored, backupId: entry.id });
      show('confirm');
    } catch (error) {
      if (current()) {
        fail(error);
      }
    } finally {
      if (alive.current) {
        setPicking(null);
      }
    }
  };
  // The iCloud row: checks for backups (the row dims meanwhile), then the
  // picker, or straight to the passkey when there is one backup.
  const start = async () => {
    if (running.current) {
      return;
    }
    running.current = true;
    setChecking(true);
    setMessage(null);
    try {
      if (Platform.OS !== 'ios') {
        throw Object.assign(new Error(), { code: 'cloud.unsupported' });
      }
      const found = [...(await listCloudBackups())].sort(
        (a, b) => b.created - a.created,
      );
      if (!current()) {
        return;
      }
      const used = inUse();
      setEntries(
        found.map(entry => ({ ...entry, active: used.has(entry.id) })),
      );
      if (!found.length) {
        show('empty');
      } else if (found.every(entry => used.has(entry.id))) {
        show('active');
      } else if (found.length === 1) {
        await pick(found[0]);
      } else {
        show('picker');
      }
    } catch (error) {
      if (current()) {
        fail(error);
      }
    } finally {
      running.current = false;
      if (alive.current) {
        setChecking(false);
      }
    }
  };
  const confirm = async () => {
    const restoring = payload;
    importing.current = true;
    show('restoring');
    try {
      await importCloudBackup(engine, restoring);
      notifyDone.current = true;
      show('done');
    } catch (error) {
      fail(error);
    } finally {
      importing.current = false;
      // The recovery secret leaves memory as soon as it is used.
      setPayload(null);
    }
  };
  const close = closedKey =>
    setSheet(previous =>
      previous.open && (closedKey === undefined || previous.key === closedKey)
        ? { ...previous, open: false }
        : previous,
    );
  // After the sheet has gone: a restored wallet closes Manage wallets too.
  const dismissed = () => {
    setPayload(null);
    if (!importing.current) {
      setEngaged(false);
    }
    if (notifyDone.current) {
      notifyDone.current = false;
      onRestored?.();
    }
  };
  return {
    start,
    checking,
    engaged,
    sheetProps: {
      open: sheet.open,
      requestKey: sheet.key,
      step: sheet.step,
      entries,
      picking,
      payload,
      message,
      onPick: pick,
      onConfirm: confirm,
      onClose: close,
      onDismiss: dismissed,
    },
  };
}
