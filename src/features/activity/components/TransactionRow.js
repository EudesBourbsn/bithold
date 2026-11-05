import { Pressable, Text, View } from 'react-native';
import { useT } from '../../../i18n/index';
import {
  activityAmount,
  formatTime,
  hasQuote,
  transactionAddresses,
  truncatedValue,
} from '../domain/transactions';
import { styles } from '../styles/TransactionDetailsStep.styles.js';
import { TransactionAssetIcon } from './TransactionAssetIcon';
export function TransactionRow({ tx, wallet, quote, currency, onPress }) {
  const t = useT();
  const received = tx.direction === 'received',
    self = tx.direction === 'self',
    pending = !(tx.confirmations > 0);

  const titleAmount = self
    ? transactionAddresses(tx, wallet).selfAmount
    : tx.amount;
  const title =
    activityAmount(titleAmount) ??
    (received
      ? t('activity.received')
      : self
      ? t('activity.selfTransfer')
      : t('activity.sent'));
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[
        pending && t('activity.pending'),
        t(
          received
            ? 'activity.received'
            : self
            ? 'activity.selfTransfer'
            : 'activity.sent',
        ),
        title,
        Number.isFinite(tx.timestamp) && formatTime(tx.timestamp),
        truncatedValue(tx.amount, quote, currency),
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityHint={
        hasQuote(quote) ? t('activity.rowHintConverted') : t('activity.rowHint')
      }
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.iconSlot}>
        <TransactionAssetIcon received={received} pending={pending} />
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowLabels}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.rowDate}>
            {Number.isFinite(tx.timestamp)
              ? formatTime(tx.timestamp)
              : t('activity.timeUnavailable')}
          </Text>
        </View>
        <Text style={[styles.rowAmount, received && styles.positive]}>
          {self
            ? t('activity.selfFee', {
                amount: truncatedValue(tx.amount, quote, currency),
              })
            : `${received ? '+' : ''}${truncatedValue(
                tx.amount,
                quote,
                currency,
              )}`}
        </Text>
      </View>
    </Pressable>
  );
}
