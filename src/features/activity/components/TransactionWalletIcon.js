import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useT } from '../../../i18n/index';
import { WalletGlyph } from '../../wallet/components/WalletAvatar';
import { transactionOctagon } from '../theme/transactionVisuals';

export function TransactionWalletIcon({ wallet, size = 24 }) {
  const t = useT();
  if (!wallet) {
    return null;
  }
  const color = wallet.color === '#7b39ff' ? '#8359ff' : wallet.color;
  return (
    <View
      accessible
      accessibilityLabel={t('transaction.walletLabel', { name: wallet.name })}
      style={[styles.icon, { width: size, height: size }]}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        style={StyleSheet.absoluteFill}
      >
        <Path d={transactionOctagon} fill={color} fillRule="evenodd" />
      </Svg>
      <WalletGlyph
        icon={wallet.icon}
        name={wallet.name}
        avatarPhoto={wallet.avatarPhoto}
        size={(size * 24) / 44}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  icon: { alignItems: 'center', justifyContent: 'center' },
});
