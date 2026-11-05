import {
  Alert,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t as translate, useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/colors';
import { bitcoinLabel } from '../../send/domain/amount';
import { fonts } from '../../../theme/fonts';

const BADGES = {
  used: { label: 'addresses.used', background: '#3A3A3C', color: '#9aa0aa' },
  change: {
    label: 'addresses.change',
    padded: true,
    background: '#5A4E4E',
    color: '#F38C47',
  },
  receive: {
    label: 'addresses.receive',
    padded: true,
    background: 'rgba(210,248,214,.2)',
    color: '#2FA380',
  },
};

export const formatAddressBalance = bitcoinLabel;

export function copyAddress(address) {
  Promise.resolve()
    .then(() => NativeModules.BitholdMedia.copyText(address))
    .then(impactFeedback)
    .catch(error =>
      Alert.alert(translate('common.copyAddress'), error.message),
    );
}
export function AddressRow({ item, label, onPress }) {
  const t = useT();
  const badge =
    item.transactions > 0
      ? BADGES.used
      : item.chain
      ? BADGES.change
      : BADGES.receive;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('addresses.rowLabel', {
        index: item.index,
        address: item.address,
      })}
      accessibilityHint={t('addresses.rowHint')}
      onPress={() => onPress(item)}
      style={styles.container}
    >
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Text style={styles.index}>{item.index}</Text>
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
            {item.address}
          </Text>
          <Text style={styles.balance}>
            {formatAddressBalance(item.balance)}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.badgesRow}>
          <View style={[styles.badge, { backgroundColor: badge.background }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>
              {badge.padded ? `${t(badge.label)}  ` : t(badge.label)}
            </Text>
          </View>
          {!!label && (
            <View style={[styles.badge, styles.labelBadge]}>
              <Text
                style={[styles.badgeText, styles.labelText]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.balance}>
          {t('addresses.transactions', { count: item.transactions })}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  leftSection: { marginRight: 10, paddingTop: 2 },
  index: { ...fonts.semibold, fontSize: 15, color: '#9aa0aa' },
  middleSection: { flex: 1, paddingRight: 12 },
  address: {
    ...fonts.bold,
    fontSize: 14,
    marginHorizontal: 4,
    color: '#ffffff',
  },
  balance: {
    marginTop: 6,
    ...fonts.semibold,
    fontSize: 14,
    color: '#9aa0aa',
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minWidth: 96,
    paddingLeft: 8,
  },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  badgeText: {
    ...fonts.regular,
    fontSize: 12,
    textAlign: 'center',
  },

  labelBadge: { maxWidth: 110, backgroundColor: '#2E2E2E' },
  labelText: { color: '#0A84FF' },
});
