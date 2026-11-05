import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../../../theme/index';
import { TransactionGlass } from './TransactionGlass';
import { TransactionStatusIcon } from './TransactionStatusIcon';

const bitcoinAsset = require('../../../../assets/icons/bitcoin.png');

export function TransactionAssetIcon({ received = false, pending = false }) {
  return (
    <View style={styles.container} pointerEvents="none" accessible={false}>
      <Image
        source={bitcoinAsset}
        style={styles.asset}
        resizeMode="contain"
        accessible={false}
      />
      <View style={styles.badge}>
        <TransactionGlass width={24} height={24} radius={12} />
        <TransactionStatusIcon received={received} pending={pending} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 50, height: 50, flexShrink: 0 },
  asset: { width: 40, height: 40 },
  badge: {
    position: 'absolute',
    left: 26,
    top: 26,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.modal,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
