import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { colors } from '../../../theme';
import { freshFees } from '../../../wallet/network/fees';
import { DiscIllustration } from '../../backup/components/DiscIllustration';
import { bitcoinLabel } from '../../send/domain/amount';
import { DetailRow } from '../components/TransactionRecipient';
import { currentValue } from '../domain/transactions';
import { styles as detailStyles } from '../styles/TransactionDetailsStep.styles.js';
import { fonts } from '../../../theme/fonts';

const COPY = {
  cancel: {
    title: 'replace.cancel.title',
    body: 'replace.cancel.body',
    action: 'replace.cancel.action',
    failed: 'replace.cancel.failed',
  },
};
const REVIEW_LIFETIME = 100000;

export function ReplacementStep({ tx, wallet, mode, onBack, onReplaced }) {
  const t = useT();
  const { engine, quote, preferences } = useWallets();
  const { width } = useWindowDimensions();
  const [prepared, setPrepared] = useState(null);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const preparedAt = useRef(0);
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );
  const copy = COPY[mode];
  const prepare = useCallback(async () => {
    let marketFees = engine.fees;
    if (!freshFees(marketFees)) {
      await engine.refreshMarketDetails().catch(() => {});
      marketFees = engine.fees;
    }
    const options = engine.replacementOptions(wallet.id, tx.id);
    if (!options.cancel) {
      throw new Error(options.reason);
    }
    const recommended = freshFees(marketFees) ? marketFees.fastestFee : 0;
    const feeRate = Math.min(1000, Math.max(options.minimumRate, recommended));
    const result = await engine.prepareReplacement(wallet.id, tx.id, {
      mode,
      feeRate,
    });
    preparedAt.current = Date.now();
    return result;
  }, [engine, wallet.id, tx.id, mode]);
  useEffect(() => {
    prepare()
      .then(result => mounted.current && setPrepared(result))
      .catch(e => mounted.current && setError(e.message));
  }, [prepare]);
  const confirm = async () => {
    if (sending || !prepared) {
      return;
    }
    setSending(true);
    try {
      let plan = prepared;
      if (Date.now() - preparedAt.current > REVIEW_LIFETIME) {
        plan = await prepare();
        if (mounted.current) {
          setPrepared(plan);
        }
      }
      const txid = await engine.send(plan.planId);
      onReplaced(txid, mode);
    } catch (e) {
      if (e.code !== 'authentication') {
        Alert.alert(t(copy.failed), `${e.message}`);
      }
    } finally {
      if (mounted.current) {
        setSending(false);
      }
    }
  };
  const fiatOr = sats =>
    quote
      ? currentValue(sats, quote, preferences.currency)
      : bitcoinLabel(sats);
  return (
    <>
      <SheetHeader title="" onBack={sending ? undefined : onBack} />
      <View style={styles.body}>
        <DiscIllustration glyph="coins" />
        <Text accessibilityRole="header" style={styles.title}>
          {t(copy.title)}
        </Text>
        <Text style={styles.description}>{t(copy.body)}</Text>
        <View style={styles.amounts}>
          {error ? (
            <View style={styles.warning}>
              <Text style={styles.warningTitle}>
                {t('replace.unavailable')}
              </Text>
              <Text style={styles.warningText}>{error}</Text>
            </View>
          ) : !prepared ? (
            <ActivityIndicator color={colors.foreground} />
          ) : (
            <View style={detailStyles.info}>
              <DetailRow
                label={t('replace.newFee')}
                value={`${fiatOr(prepared.networkFeeSatoshis)} · ${bitcoinLabel(
                  prepared.networkFeeSatoshis,
                )}`}
              />
              <DetailRow
                label={t('replace.additionalFee')}
                value={fiatOr(
                  prepared.networkFeeSatoshis - prepared.originalFee,
                )}
              />
              <DetailRow
                label={t('review.feeRate')}
                value={`${prepared.feeRate} sat/vB`}
              />
              <DetailRow
                label={t('replace.returns')}
                value={bitcoinLabel(prepared.returned)}
                last
              />
            </View>
          )}
        </View>
        <PrimaryButton
          label={sending ? t('replace.submitting') : t(copy.action)}
          disabled={!prepared || !!error || sending}
          onPress={confirm}
          style={[styles.button, { width: width - 50 }]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 40,
    color: colors.foreground,
    ...fonts.semibold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    marginHorizontal: 32,
    color: 'rgba(255, 255, 255, 0.72)',
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  amounts: {
    width: '100%',
    marginTop: 24,
    minHeight: 40,
    justifyContent: 'center',
  },
  warning: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#F38C4729',
    gap: 4,
  },
  warningTitle: {
    ...fonts.semibold,
    fontSize: 14,
    lineHeight: 24,
    color: colors.foreground,
  },
  warningText: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  button: {
    marginTop: 24,
  },
});
