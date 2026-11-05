import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { impactFeedback } from '../../../services/feedback';

export function useResetWalletFlow({
  visible,
  requestKey,
  requireUnlock,
  onConfirm,
  onClose,
}) {
  const session = useMemo(
    () => ({ active: visible, pending: false, step: 'settings', requestKey }),
    [visible, requestKey],
  );
  const currentSession = useRef(session);
  currentSession.current = session;
  const [step, setStep] = useState('settings');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    session.active = visible;
    // On closing too, so a reopened Settings never starts on a stale step.
    setStep('settings');
    if (visible) {
      setBusy(false);
    }
    return () => {
      session.active = false;
    };
  }, [session, visible]);

  const go = next => {
    if (
      currentSession.current !== session ||
      !session.active ||
      session.pending
    ) {
      return;
    }
    Keyboard.dismiss();
    impactFeedback();
    session.step = next;
    setStep(next);
  };
  // The delete sheet was dismissed: back to Settings, and a confirmation
  // still waiting on the passcode no longer erases anything.
  const dismiss = () => {
    if (currentSession.current !== session || !session.active) {
      return;
    }
    session.step = 'settings';
    setStep('settings');
  };
  const close = (key = requestKey) => {
    if (key !== requestKey || currentSession.current !== session) {
      return;
    }
    session.active = false;
    onClose(key);
  };
  const confirm = async () => {
    if (
      currentSession.current !== session ||
      !session.active ||
      session.pending ||
      session.step !== 'resetConfirm'
    ) {
      return;
    }
    session.pending = true;
    setBusy(true);
    impactFeedback();
    try {
      await requireUnlock({ reason: 'reset' });
      if (
        session.active &&
        currentSession.current === session &&
        session.step === 'resetConfirm'
      ) {
        session.active = false;
        onConfirm();
      }
    } catch {
      return;
    } finally {
      session.pending = false;
      if (session.active && currentSession.current === session) {
        setBusy(false);
      }
    }
  };

  return {
    step,
    busy,
    close,
    dismiss,
    start: () => go('reset'),
    next: () => go('resetConfirm'),
    cancel: () => go('settings'),
    confirm,
  };
}
