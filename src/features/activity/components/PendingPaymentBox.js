import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useT } from '../../../i18n/index';
import { buttonMetrics, colors, typography } from '../../../theme';
import { WarningIcon } from '../../backup/components/RecoveryMethod';
import { TransactionGlass } from './TransactionGlass';
import { fonts } from '../../../theme/fonts';

const PILL = buttonMetrics.primary.height;

function PillButton({ label, onPress, disabled }) {
  const [width, setWidth] = useState(0);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
      style={[styles.pill, disabled && styles.disabled]}
    >
      {width > 0 && (
        <TransactionGlass width={width} height={PILL} radius={PILL / 2} />
      )}
      <Text style={styles.pillText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PendingPaymentBox({ lowFee, onSpeedUp, onCancel }) {
  const t = useT();
  return (
    <View style={styles.box}>
      <View style={styles.banner}>
        <View style={styles.content}>
          <View style={styles.icon}>
            <WarningIcon />
          </View>
          <View style={styles.texts}>
            <Text style={styles.title}>{t('pending.title')}</Text>
            <Text style={styles.message}>
              {lowFee ? t('pending.lowFee') : t('pending.message')}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <PillButton label={t('pending.speedUp')} onPress={onSpeedUp} />
          <PillButton label={t('pending.cancel')} onPress={onCancel} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    minWidth: 258,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F38C4729',
    gap: 16,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flexShrink: 1,
  },
  title: {
    ...fonts.semibold,
    fontSize: 14,
    lineHeight: 24,
    color: colors.foreground,
  },
  message: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    height: PILL,
    borderRadius: PILL / 2,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pillText: {
    ...typography.button,
    color: colors.foreground,
  },
  disabled: { opacity: 0.45 },
});
