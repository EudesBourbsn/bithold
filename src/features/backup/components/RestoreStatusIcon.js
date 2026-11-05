import { StyleSheet } from 'react-native';
import { NativeSymbol } from '../../../components/icons/Icon';
import { StatusIconPlate } from '../../../components/illustrations/StatusIconPlate';
import { colors } from '../../../theme/index';

export function RestoreStatusIcon({ symbol }) {
  return (
    <StatusIconPlate discSize={120} iconSize={54} reserveShadow={false}>
      <NativeSymbol
        symbolName={symbol}
        pointSize={54}
        weight="medium"
        tintColor={colors.foreground}
        style={styles.symbol}
      />
    </StatusIconPlate>
  );
}
const styles = StyleSheet.create({ symbol: { width: 54, height: 54 } });
