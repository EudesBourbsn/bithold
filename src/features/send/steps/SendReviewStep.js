import { StyleSheet, Text, View } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { colors, sheetMetrics, typography } from '../../../theme/index';
import { AddressCapsule } from '../components/AddressCapsule';
import { SlideToConfirm } from '../components/SlideToConfirm';
import {
  bitcoinLabel,
  bitcoinText,
  rateLabel,
  currencySymbol,
} from '../domain/amount';
import { fonts } from '../../../theme/fonts';

export function SummaryRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={[typography.summaryLabel, styles.label]}>{label}</Text>
      <Text style={[typography.capsule, styles.value]}>{value}</Text>
    </View>
  );
}
export function SendReviewStep({
  draft,
  onBack,
  onNetworkFee,
  onConfirm,
  busy,
}) {
  const t = useT();
  const { preferences } = useWallets();
  return (
    <View>
      <SheetHeader
        onBack={onBack}
        rightIcon="more"
        rightLabel={t('review.customizeFees')}
        onRight={() => {
          if (!busy) {
            onNetworkFee();
          }
        }}
      />
      <View style={styles.heroGap} />
      <View style={styles.hero}>
        <View style={styles.amountRow}>
          {draft.isFiat && (
            <Text style={typography.amountUnit}>
              {currencySymbol(draft.currency ?? preferences.currency)}
            </Text>
          )}
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.amount}>
            {draft.isFiat ? draft.enteredAmount : bitcoinText(draft.satoshis)}
          </Text>
          {!draft.isFiat && <Text style={typography.amountUnit}> BTC</Text>}
        </View>
        <View style={styles.toGap} />
        <Text style={typography.reviewDestination}>{t('review.to')}</Text>
        <View style={styles.toGap} />
        <AddressCapsule address={draft.address} review />
      </View>
      <View style={styles.summaryGap} />
      <View style={styles.summary}>
        <SummaryRow
          label={t('review.amount')}
          value={bitcoinLabel(draft.satoshis)}
        />
        <View style={styles.divider} />
        <SummaryRow
          label={t('send.networkFee')}
          value={bitcoinLabel(draft.networkFeeSatoshis)}
        />
        <View style={styles.detailGap} />
        <SummaryRow
          label={t('review.total')}
          value={bitcoinLabel(draft.satoshis + draft.networkFeeSatoshis)}
        />
        <View style={styles.detailGap} />
        <SummaryRow
          label={t('review.feeRate')}
          value={`${rateLabel(draft.feeRate)} sat/vB`}
        />
      </View>
      <View style={styles.summaryGap} />
      <View style={styles.slider}>
        <SlideToConfirm onConfirmed={onConfirm} />
      </View>
      <View style={styles.bottom} />
    </View>
  );
}
const styles = StyleSheet.create({
  heroGap: { height: 24 },
  hero: {
    paddingHorizontal: sheetMetrics.review.heroInset,
    alignItems: 'center',
  },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', maxWidth: '100%' },
  amount: {
    ...fonts.semibold,
    fontSize: 60,
    letterSpacing: -0.6,
    color: 'white',
    flexShrink: 1,
  },
  toGap: { height: 12 },
  summaryGap: { height: 24 },
  summary: { paddingHorizontal: sheetMetrics.review.summaryInset },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: sheetMetrics.review.rowGap,
  },
  label: { flex: 1 },
  value: { flex: 1, textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 16 },
  detailGap: { height: sheetMetrics.review.detailGap },
  slider: { paddingHorizontal: 30 },
  bottom: { height: 30 },
});
