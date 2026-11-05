import { useCallback, useState, useEffect, useRef } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { playSound } from '../../../services/sound';
import { defaultFeeRate, freshFees } from '../../../wallet/network/fees';
import { sendCompletionMotion } from '../components/sendCompletionMotion';
import { SendStatusBar } from '../components/SendStatusBar';
import { bitcoin, bitcoinLabel, currencyDigits, fiat } from '../domain/amount';
import { QrScannerModal } from '../modals/QrScannerModal';
import { NetworkFeeStep } from '../steps/NetworkFeeStep';
import { SendAddressStep } from '../steps/SendAddressStep';
import { SendAmountStep } from '../steps/SendAmountStep';
import { SendReviewStep } from '../steps/SendReviewStep';

export function SendBitcoinSheet({ visible, requestKey = 0, onClose }) {
  const t = useT();
  const { selectedWallet, engine, quote, preferences } = useWallets();
  const [preparing, setPreparing] = useState(false);
  const preparation = useRef(null);
  const currentWalletId = useRef(selectedWallet?.id);
  currentWalletId.current = selectedWallet?.id;
  const sending = useRef(false);
  const [submission, setSubmission] = useState(null);
  const [sheetHidden, setSheetHidden] = useState(false);
  const [dismissRequested, setDismissRequested] = useState(false);
  const submissionSequence = useRef(0);
  const submissionId = useRef(null);
  const closingForSend = useRef(false);
  const sheetDismissed = useRef(false);
  const pendingError = useRef(null);
  const mounted = useRef(true);
  const currentlyVisible = useRef(visible);
  currentlyVisible.current = visible;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      preparation.current = null;
    };
  }, []);
  useEffect(() => {
    preparation.current = null;
    setPreparing(false);
    setStep('address');
    setDraft(null);
    setAddress('');
    setNote('');
  }, [selectedWallet?.id]);
  useEffect(() => {
    if (!visible || (!sending.current && !closingForSend.current)) {
      preparation.current = null;
      setPreparing(false);
      setStep('address');
      setDraft(null);
      setAddress('');
      setNote('');
      setScanning(false);
    }
  }, [visible, requestKey]);
  const [step, setStep] = useState('address'),
    [address, setAddress] = useState(''),
    [note, setNote] = useState(''),
    [draft, setDraft] = useState(null),
    [scanning, setScanning] = useState(false);
  const go = next => {
    preparation.current = null;
    setPreparing(false);
    Keyboard.dismiss();
    impactFeedback();
    setStep(next);
  };
  const updateDraft = useCallback(value => setDraft(value), []);
  const close = (closedRequestKey = requestKey) => {
    if (sending.current) {
      return;
    }
    preparation.current = null;
    setPreparing(false);
    setStep('address');
    setAddress('');
    setNote('');
    setDraft(null);
    setScanning(false);
    onClose(closedRequestKey);
  };
  const prepare = async (value, rate) => {
    if (
      preparation.current ||
      sending.current ||
      !selectedWallet ||
      !currentlyVisible.current
    ) {
      return;
    }
    const request = {};
    const walletId = selectedWallet.id;
    preparation.current = request;
    const current = () =>
      mounted.current &&
      currentlyVisible.current &&
      preparation.current === request &&
      currentWalletId.current === walletId;
    setPreparing(true);
    try {
      if (rate == null) {
        if (!freshFees(engine.fees)) {
          await engine.refreshMarketDetails();
        }

        if (!freshFees(engine.fees)) {
          throw new Error(t('send.feesUnavailable'));
        }
        rate = defaultFeeRate(engine.fees);
      }
      if (!current()) {
        return;
      }
      const prepared = await engine.prepare(walletId, {
        ...value,
        feeRate: rate,
      });
      if (!current()) {
        engine.plans?.delete(prepared.planId);
        return;
      }
      if (value.sendMax) {
        const conversionQuote = value.conversionQuote ?? quote;
        prepared.enteredAmount =
          value.isFiat && conversionQuote
            ? ((prepared.satoshis / 100000000) * conversionQuote).toFixed(
                currencyDigits(value.currency ?? preferences.currency),
              )
            : bitcoin(prepared.satoshis);
        prepared.isFiat = value.isFiat && !!conversionQuote;
      }
      setDraft(prepared);
      go('review');
    } catch (error) {
      if (current()) {
        Alert.alert(
          t('send.prepareFailed'),
          error.code === 'insufficient'
            ? t('send.insufficientWarning')
            : error.message,
        );
      }
    } finally {
      if (preparation.current === request) {
        preparation.current = null;
        setPreparing(false);
      }
    }
  };
  const confirm = async () => {
    if (
      sending.current ||
      preparation.current ||
      !draft?.planId ||
      !currentlyVisible.current ||
      (draft.walletId && draft.walletId !== currentWalletId.current)
    ) {
      return;
    }
    sending.current = true;
    closingForSend.current = true;
    sheetDismissed.current = false;
    pendingError.current = null;
    const id = ++submissionSequence.current;
    submissionId.current = id;
    const amount = draft.isFiat
      ? fiat(
          Number(draft.enteredAmount),
          draft.currency ?? preferences.currency,
        )
      : bitcoinLabel(draft.satoshis);
    const text = t('send.statusText', { amount });
    const walletId = draft.walletId ?? currentWalletId.current,
      personalNote = note.trim();
    setSubmission({ id, phase: 'progress', text, amount });
    setDismissRequested(true);
    try {
      const txid = await engine.send(draft.planId);
      playSound('send');
      if (personalNote) {
        engine.setNote(walletId, txid, personalNote).catch(() => {});
      }
      if (mounted.current) {
        setSubmission({ id, phase: 'finished', text, amount, txid });
        impactFeedback();
      }
    } catch (error) {
      if (mounted.current) {
        setSubmission(null);
        pendingError.current = error?.message ?? t('send.submitFailed');
        if (sheetDismissed.current) {
          showSubmissionError();
        }
      }
    } finally {
      sending.current = false;
    }
  };
  const showSubmissionError = () => {
    const message = pendingError.current;
    if (!message) {
      return;
    }
    pendingError.current = null;
    Alert.alert(
      t('send.paymentTitle'),
      message,
      [
        {
          text: t('common.ok'),
          onPress: () => {
            closingForSend.current = false;
            submissionId.current = null;
            sheetDismissed.current = false;
            setDismissRequested(false);
            setSheetHidden(false);
          },
        },
      ],
      { cancelable: false },
    );
  };
  const completeSubmission = id => {
    if (submissionId.current !== id) {
      return;
    }
    submissionId.current = null;
    closingForSend.current = false;
    sheetDismissed.current = false;
    setSubmission(null);
    setDismissRequested(false);
    setSheetHidden(false);
    setStep('address');
    setAddress('');
    setNote('');
    setDraft(null);
    setScanning(false);
    if (currentlyVisible.current) {
      onClose(requestKey);
    }
  };
  return (
    <>
      <SendStatusBar status={submission} onComplete={completeSubmission} />
      <AdaptiveSheet
        visible={visible && !sheetHidden}
        requestKey={requestKey}
        onClose={closedRequestKey => {
          if (closingForSend.current) {
            setSheetHidden(true);
          } else {
            close(closedRequestKey);
          }
        }}
        onDismiss={() => {
          if (closingForSend.current) {
            sheetDismissed.current = true;
            showSubmissionError();
          }
        }}
        dismissRequested={dismissRequested}
        dismissSpring={
          dismissRequested ? sendCompletionMotion.sheetExit : undefined
        }
        step={step}
      >
        {step === 'address' ? (
          <SendAddressStep
            address={address}
            note={note}
            setNote={setNote}
            setAddress={value => {
              setAddress(value);
              if (draft?.address !== value) {
                setDraft(null);
              }
            }}
            onScan={() => {
              Keyboard.dismiss();
              impactFeedback();
              setScanning(true);
            }}
            onContinue={value => {
              setAddress(value);
              go('amount');
            }}
          />
        ) : step === 'amount' ? (
          <SendAmountStep
            busy={preparing}
            address={address}
            draft={draft}
            onDraft={updateDraft}
            onBack={() => go('address')}
            onContinue={value => {
              setDraft(value);
              prepare(value, value.feeRate);
            }}
          />
        ) : step === 'fee' ? (
          <NetworkFeeStep
            busy={preparing}
            draft={draft}
            onBack={() =>
              go(draft.networkFeeSatoshis == null ? 'amount' : 'review')
            }
            onConfirm={({ feeRate, rbf }) =>
              prepare({ ...draft, rbf }, feeRate)
            }
          />
        ) : (
          <SendReviewStep
            draft={draft}
            busy={preparing}
            onBack={() => go('amount')}
            onNetworkFee={() => go('fee')}
            onConfirm={confirm}
          />
        )}
        <QrScannerModal
          visible={scanning}
          onClose={() => setScanning(false)}
          onScanned={value => {
            setAddress(value);
            setDraft(null);
            setScanning(false);
          }}
        />
      </AdaptiveSheet>
    </>
  );
}
