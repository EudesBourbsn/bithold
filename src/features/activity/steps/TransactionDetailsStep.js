import { useState } from 'react';
import { Alert, Image, Linking, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { bitcoinLabel } from '../../send/domain/amount';
import { PendingPaymentBox } from '../components/PendingPaymentBox';
import { bitcoinAsset, HeroAmount } from '../components/TransactionHero';
import { TransactionLoadingDots } from '../components/TransactionLoadingDots';
import {
  Recipient,
  DetailRow,
  Addresses,
  FeePill,
  PersonalNoteRow,
} from '../components/TransactionRecipient';
import {
  accelerateURL,
  currentValue,
  formatTimestamp,
  fromNow,
  hasQuote,
  transactionAddresses,
  transactionURL,
  truncateAddress,
} from '../domain/transactions';
import { styles } from '../styles/TransactionDetailsStep.styles.js';

function headerTitle(t, received, self, complete) {
  if (self) {
    return t('activity.selfTransfer');
  }

  return received
    ? complete
      ? t('activity.received')
      : t('transaction.receiving')
    : complete
    ? t('activity.sent')
    : t('transaction.sending');
}
export function TransactionDetailsStep({
  tx,
  wallet,
  quote,
  currency,
  note,
  onEditNote,
  replaceable,
  lowFee,
  onReplace,
}) {
  const t = useT();
  const { electrum, preferences } = useWallets();
  const [recipientWidth, setRecipientWidth] = useState(0);
  const { from, to, selfAmount } = transactionAddresses(tx, wallet);
  const received = tx.direction === 'received',
    self = tx.direction === 'self';
  const peers = received ? from : to;
  const amount = self ? selfAmount : tx.amount;
  const complete = tx.confirmations > 0;
  const priced = hasQuote(quote);

  const showPill = !self && peers.length > 0;
  const date = Number.isFinite(tx.timestamp)
    ? complete
      ? formatTimestamp(tx.timestamp)
      : fromNow(tx.timestamp)
    : t('transaction.unavailable');
  const showFee = !received && Number.isFinite(tx.fee);
  const depositRow = showPill && received && to.length > 0;
  const txURL = transactionURL(
    tx.id,
    wallet.network,
    electrum?.variants?.[wallet.network],
    preferences.blockExplorer,
  );
  return (
    <>
      <SheetHeader
        title={headerTitle(t, received, self, complete)}
        titleStyle={styles.heading}
      />
      <View style={styles.body}>
        <View style={styles.hero}>
          <Image source={bitcoinAsset} style={styles.heroIcon} />
          <HeroAmount
            sats={amount}
            quote={quote}
            currency={currency}
            received={received}
          />
          {self && (
            <Text style={styles.muted}>{t('transaction.selfNote')}</Text>
          )}
          {showPill && (
            <View style={styles.recipientGroup}>
              <Text style={styles.muted}>
                {received ? t('transaction.from') : t('review.to')}
              </Text>
              <Recipient
                addresses={peers}
                wallet={wallet}
                width={recipientWidth}
                onWidth={setRecipientWidth}
              />
            </View>
          )}
        </View>

        {replaceable && !complete && (
          <PendingPaymentBox
            lowFee={lowFee}
            onSpeedUp={() => {
              const url = accelerateURL(tx.id);
              if (url) {
                impactFeedback();
                Linking.openURL(url).catch(error =>
                  Alert.alert(t('transaction.title'), error.message),
                );
              }
            }}
            onCancel={() => onReplace('cancel')}
          />
        )}
        <View style={styles.info}>
          <DetailRow label={t('transaction.status')}>
            {complete ? (
              <>
                <Text style={styles.value}>{t('transaction.complete')}</Text>
                <Svg width={16} height={16} style={styles.checkIcon}>
                  <Path
                    d="m3 8 3 3 7-7"
                    stroke="#5BD800"
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </>
            ) : (
              <>
                <Text style={[styles.value, styles.pendingValue]}>
                  {t('activity.pending')}
                </Text>
                <TransactionLoadingDots size={3} />
              </>
            )}
          </DetailRow>
          <DetailRow
            label={t('review.amount')}
            copyValue={bitcoinLabel(amount)}
          >
            <Text style={styles.value}>{bitcoinLabel(amount)}</Text>
            <Image source={bitcoinAsset} style={styles.amountIcon} />
          </DetailRow>
          <DetailRow label={t('transaction.date')} value={date} />

          {!showPill &&
            (received ? (
              <Addresses
                label={
                  complete
                    ? t('transaction.receivedFrom')
                    : t('transaction.receivingFrom')
                }
                addresses={from}
                network={wallet.network}
              />
            ) : (
              <>
                <Addresses
                  label={
                    complete
                      ? t('transaction.sentTo')
                      : t('transaction.sendingTo')
                  }
                  addresses={to}
                  network={wallet.network}
                />
                <Addresses
                  label={
                    complete
                      ? t('transaction.sentFrom')
                      : t('transaction.sendingFrom')
                  }
                  addresses={from}
                  network={wallet.network}
                />
              </>
            ))}
          <DetailRow
            label={t('transaction.id')}
            value={truncateAddress(tx.id)}
            copyValue={tx.id}
            url={txURL}
          />

          {depositRow && (
            <Addresses
              label={
                complete
                  ? t('transaction.depositedTo')
                  : t('transaction.depositingTo')
              }
              addresses={to}
              network={wallet.network}
            />
          )}
          {showFee && (
            <DetailRow label={t('transaction.fee')}>
              <FeePill
                fiatLabel={
                  priced ? currentValue(tx.fee, quote, currency) : null
                }
                bitcoinLabel={bitcoinLabel(tx.fee)}
              />
            </DetailRow>
          )}
          {priced && (
            <DetailRow
              label={t('transaction.now')}
              value={currentValue(amount, quote, currency)}
            />
          )}

          <PersonalNoteRow message={note} onPress={onEditNote} />
        </View>
      </View>
    </>
  );
}
