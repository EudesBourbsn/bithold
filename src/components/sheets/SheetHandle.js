import { StyleSheet, View } from 'react-native';
import { colors, sheetMetrics } from '../../theme/index';

export function SheetHandle() {
  return (
    <View pointerEvents="none" accessible={false} style={styles.position}>
      <View style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    top: sheetMetrics.handle.top,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  indicator: {
    width: sheetMetrics.handle.width,
    height: sheetMetrics.handle.height,
    borderRadius: sheetMetrics.handle.radius,
    backgroundColor: colors.sheetHandle,
  },
});
