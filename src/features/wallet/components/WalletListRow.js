import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useT } from '../../../i18n/index';
import { colors, typography } from '../../../theme/index';
import { WalletAvatar } from './WalletAvatar';

const menuPath =
  'M21.686 12.575c.41-1.81-1.2-3.42-3.01-3.01-.92.21-1.66.95-1.86 1.86a2.507 2.507 0 003.01 3.01c.92-.21 1.66-.95 1.86-1.86zm-7 0a2.507 2.507 0 00-3.01-3.01c-.92.21-1.66.95-1.86 1.86a2.507 2.507 0 003.01 3.01c.92-.21 1.66-.95 1.86-1.86zm-7.5 0a2.507 2.507 0 00-3.01-3.01c-.92.21-1.66.95-1.86 1.86a2.507 2.507 0 003.01 3.01c.92-.21 1.66-.95 1.86-1.86z';

const palette = {
  controlBackground: '#2B2B2E',
  controlForeground: '#A0A1AD',
};

export function WalletListRow({ wallet, selected, onSelect, onSettings }) {
  const t = useT();
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="radio"
        accessibilityLabel={wallet.name}
        accessibilityState={{ checked: selected }}
        onPress={onSelect}
        style={styles.wallet}
      >
        <View
          accessible={false}
          style={[styles.radio, selected && styles.selectedRadio]}
        >
          {selected && <View style={styles.radioDot} />}
        </View>
        <WalletAvatar wallet={wallet} size={40} />
        <Text
          numberOfLines={1}
          style={[typography.walletListName, styles.name]}
        >
          {wallet.name}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('manageWallets.settingsFor', {
          name: wallet.name,
        })}
        hitSlop={8}
        onPress={onSettings}
        style={({ pressed }) => [styles.more, pressed && styles.pressed]}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path d={menuPath} fill={palette.controlForeground} />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  wallet: {
    minHeight: 72,
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  name: { flex: 1, minWidth: 0, flexShrink: 1 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.controlForeground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: { borderColor: colors.gold },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  more: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.controlBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
});
