import { useEffect, useState } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { freshFees } from '../../../wallet/network/fees';
import { SettingsModal } from '../../settings/components/SettingsModal';
import { SettingsRow } from '../../settings/components/SettingsRow';
import { TransactionBackground } from '../components/TransactionHero';
import { TransactionRow } from '../components/TransactionRow';
import { TransactionStatusIcon } from '../components/TransactionStatusIcon';
import { activityGroups } from '../domain/transactions';
import { PersonalNoteStep } from '../steps/PersonalNoteStep';
import { ReplacementStep } from '../steps/ReplacementStep';
import { TransactionDetailsStep } from '../steps/TransactionDetailsStep';
import { fonts } from '../../../theme/fonts';
import { sheetMetrics } from '../../../theme/index';

export function TransactionsSheet({ visible, requestKey = 0, onClose }) {
  const t = useT();
  const { selectedWallet, pending, engine, quote, preferences, notes, fees } =
    useWallets();
  const transactions = selectedWallet?.snapshot?.transactions ?? [];
  const unresolved = pending.filter(
    p => p.walletId === selectedWallet?.id && !p.accepted,
  );

  const [details, setDetails] = useState({
    open: false,
    key: 0,
    txId: null,
    step: 'details',
  });
  useEffect(() => {
    setDetails(previous =>
      previous.open ? { ...previous, open: false } : previous,
    );
  }, [visible, requestKey, selectedWallet?.id]);
  const selectedTx = transactions.find(tx => tx.id === details.txId);
  const note = selectedTx
    ? notes?.[selectedWallet?.id]?.[selectedTx.id] ?? ''
    : '';
  const showStep = step =>
    setDetails(previous => (previous.open ? { ...previous, step } : previous));

  const replacement =
    selectedTx && selectedWallet && !(selectedTx.confirmations > 0)
      ? engine.replacementOptions(selectedWallet.id, selectedTx.id)
      : null;
  const lowFee =
    !!replacement?.originalRate &&
    freshFees(fees) &&
    replacement.originalRate < fees.fastestFee;
  const groups = activityGroups(transactions);
  return (
    <SettingsModal
      visible={visible}
      requestKey={requestKey}
      onClose={onClose}
      step="activity"
      rootStep="activity"
      header={<SheetHeader title={t('activity.title')} />}
    >
      <View>
        {unresolved.map(tx => (
          <SettingsRow
            key={tx.txid}
            title={t('activity.unknownBroadcast')}
            subtitle={tx.txid}
            glyph={<TransactionStatusIcon pending />}
            onPress={() =>
              Alert.alert(
                t('activity.checkPayment'),
                t('activity.checkPaymentMessage'),
                [
                  {
                    text: t('common.cancel'),
                  },
                  {
                    text: t('activity.refresh'),
                    onPress: () =>
                      engine
                        .refresh(tx.walletId)
                        .catch(e =>
                          Alert.alert(t('activity.connection'), e.message),
                        ),
                  },
                  {
                    text: t('activity.resubmit'),
                    onPress: () =>
                      engine
                        .retryPending(tx.txid)
                        .then(() => Alert.alert(t('activity.submitted')))
                        .catch(e =>
                          Alert.alert(t('activity.broadcast'), e.message),
                        ),
                  },
                ],
              )
            }
          />
        ))}
        {!transactions.length && (
          <Text style={styles.empty}>
            {selectedWallet?.snapshot
              ? t('activity.empty')
              : selectedWallet?.sync?.error ?? t('activity.syncing')}
          </Text>
        )}
        {groups.map(group => (
          <View key={group.key}>
            <Text style={styles.date}>{group.label}</Text>
            {group.transactions.map(tx => (
              <TransactionRow
                key={tx.id}
                wallet={selectedWallet}
                tx={tx}
                quote={quote}
                currency={preferences.currency}
                onPress={() =>
                  setDetails(previous => ({
                    open: true,
                    key: previous.key + 1,
                    txId: tx.id,
                    step: 'details',
                  }))
                }
              />
            ))}
          </View>
        ))}
      </View>
      <AdaptiveSheet
        visible={visible && details.open && !!selectedTx}
        requestKey={details.key}
        onClose={closedKey =>
          setDetails(previous =>
            closedKey === previous.key
              ? { ...previous, open: false }
              : previous,
          )
        }
        tall={details.step === 'details'}
        step={details.step}
        background={
          details.step === 'details' ? <TransactionBackground /> : undefined
        }
      >
        {selectedTx &&
          (details.step === 'cancel' ? (
            <ReplacementStep
              key={details.step}
              tx={selectedTx}
              wallet={selectedWallet}
              mode={details.step}
              onBack={() => showStep('details')}
              onReplaced={() => {
                impactFeedback();
                setDetails(previous => ({ ...previous, open: false }));
                Alert.alert(
                  t('activity.cancelledTitle'),
                  t('activity.cancelledMessage'),
                );
              }}
            />
          ) : details.step === 'note' ? (
            <PersonalNoteStep
              message={note}
              onBack={() => showStep('details')}
              onSave={message =>
                engine.setNote(selectedWallet.id, selectedTx.id, message)
              }
            />
          ) : (
            <TransactionDetailsStep
              tx={selectedTx}
              wallet={selectedWallet}
              quote={quote}
              currency={preferences.currency}
              note={note}
              onEditNote={() => showStep('note')}
              replaceable={!!replacement?.cancel}
              lowFee={lowFee}
              onReplace={mode => {
                impactFeedback();
                showStep(mode);
              }}
            />
          ))}
      </AdaptiveSheet>
    </SettingsModal>
  );
}
const styles = StyleSheet.create({
  date: {
    paddingHorizontal: sheetMetrics.row.horizontalInset,
    height: 40,
    paddingTop: 20,
    ...fonts.medium,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF80',
  },

  empty: {
    paddingHorizontal: sheetMetrics.content.horizontalInset,
    paddingTop: 60,
    textAlign: 'center',
    ...fonts.medium,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
