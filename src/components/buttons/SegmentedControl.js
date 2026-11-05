import {
  Platform,
  StyleSheet,
  View,
  requireNativeComponent,
} from 'react-native';

const NativeSegmentedControl =
  Platform.OS === 'ios'
    ? requireNativeComponent('BitholdSegmentedControl')
    : null;

export function SegmentedControl({ values, selectedIndex, onChange }) {
  if (!NativeSegmentedControl) {
    return null;
  }
  return (
    <View style={styles.container}>
      <NativeSegmentedControl
        values={values}
        selectedIndex={selectedIndex}
        onChange={event => onChange(event.nativeEvent.selectedIndex)}
        style={styles.control}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: 18, minHeight: 40 },
  control: { height: 40 },
});
