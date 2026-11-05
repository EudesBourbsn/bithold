import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useT } from '../../../i18n/index';
import {
  discardCloudBackup,
  prepareCloudBackup,
  saveCloudBackup,
} from '../../../wallet/platform/cloudBackup';
import { cloudBackupErrorMessage } from '../../../wallet/platform/cloudBackupError';

const PILL_DISMISS = 1500;
const codeOf = error => String(error?.code ?? '').replace(/^cloud\./, '');

export function useCloudBackup(visible = true, ownerId, ownerKey = 0) {
  const { engine } = useWallets();
  const t = useT();
  const [sheet, setSheet] = useState({ open: false, key: 0, step: 'protect' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pill, setPill] = useState({ shown: false, status: 'progress' });
  const operation = useRef(null);
  const alive = useRef(true);
  const owner = useRef(null);
  owner.current = { visible, id: ownerId, key: ownerKey };
  const walletId = useRef(null);
  const sheetRef = useRef(sheet);
  sheetRef.current = sheet;
  const dismissTimer = useRef(null);
  const cancelPreparation = () => {
    if (operation.current?.phase === 'prepare') {
      operation.current.cancelled = true;
    }
  };
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      cancelPreparation();
      clearTimeout(dismissTimer.current);
    };
  }, []);
  useEffect(() => {
    cancelPreparation();
    setSheet(previous =>
      previous.open ? { ...previous, open: false } : previous,
    );
  }, [visible, ownerId, ownerKey]);

  const show = useCallback((step, force = false) => {
    if (!alive.current || (!force && !owner.current.visible)) {
      return;
    }
    setSheet(previous => ({
      open: true,
      key: previous.open ? previous.key : previous.key + 1,
      step,
    }));
  }, []);
  const hide = closedKey => {
    if (closedKey !== undefined && closedKey !== sheetRef.current.key) {
      return;
    }
    sheetRef.current = { ...sheetRef.current, open: false };
    setSheet(previous => ({ ...previous, open: false }));
  };
  const close = closedKey => {
    if (closedKey !== undefined && closedKey !== sheetRef.current.key) {
      return;
    }
    cancelPreparation();
    hide(closedKey);
  };
  const fail = (error, uploading = false) => {
    const code = codeOf(error);
    if (code === 'cancelled') {
      return;
    }
    if (!uploading && code === 'accountUnavailable') {
      setMessage(t('cloud.accountUnavailable'));
      show('access');
    } else if (!uploading && code === 'prfUnsupported') {
      setMessage(t('cloud.prfUnsupported'));
      show('passkeys');
    } else {
      setMessage(cloudBackupErrorMessage(t, error));
      show('error', uploading);
    }
  };
  const open = (id, isProtected) => {
    if (operation.current || !alive.current || !owner.current.visible) {
      return;
    }
    walletId.current = id;
    setMessage(null);
    show(isProtected ? 'protected' : 'protect');
  };
  const secure = async () => {
    if (
      operation.current ||
      !sheetRef.current.open ||
      sheetRef.current.step !== 'protect'
    ) {
      return;
    }
    const task = {
      walletId: walletId.current,
      owner: owner.current,
      phase: 'prepare',
      cancelled: false,
    };
    operation.current = task;
    const current = () =>
      alive.current &&
      !task.cancelled &&
      operation.current === task &&
      owner.current.visible &&
      owner.current.id === task.owner.id &&
      owner.current.key === task.owner.key;
    let preparation;
    setLoading(true);
    try {
      if (Platform.OS !== 'ios') {
        throw Object.assign(new Error(), { code: 'cloud.unsupported' });
      }
      preparation = await prepareCloudBackup(engine, task.walletId);
      if (!current()) {
        return;
      }
      task.phase = 'upload';
      hide();
      clearTimeout(dismissTimer.current);
      setPill({ shown: true, status: 'progress' });
      await saveCloudBackup(engine, task.walletId, { prepared: preparation });
      if (alive.current) {
        setPill({ shown: true, status: 'finished' });
        dismissTimer.current = setTimeout(() => {
          if (alive.current) {
            setPill(previous => ({ ...previous, shown: false }));
          }
        }, PILL_DISMISS);
      }
    } catch (error) {
      if (alive.current && (task.phase === 'upload' || current())) {
        setPill(previous => ({ ...previous, shown: false }));
        fail(error, task.phase === 'upload');
      }
    } finally {
      await discardCloudBackup(preparation).catch(() => {});
      if (operation.current === task) {
        operation.current = null;
      }
      if (alive.current) {
        setLoading(false);
      }
    }
  };
  return {
    open,
    pill,
    sheetProps: {
      open: sheet.open,
      requestKey: sheet.key,
      step: sheet.step,
      loading,
      message,
      onSecure: secure,
      onClose: close,
    },
  };
}
