import { StyleSheet, View } from 'react-native';
import { SheetNavigationButton } from './SheetNavigationButton';

export function BackHeader({ onBack, disabled = false, style }) {
  return (
    <View pointerEvents="box-none" style={[styles.bar, style]}>
      <SheetNavigationButton
        disabled={disabled}
        onPress={onBack}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 44,
    justifyContent: 'center',
  },
  button: { marginLeft: 20, alignSelf: 'flex-start' },
});
