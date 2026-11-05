import { StyleSheet } from 'react-native';
import { sheetMetrics } from '../../theme/index';
import { PrimaryButton } from '../buttons/PrimaryButton';

export function SheetButton({ style, textStyle, status = false, ...props }) {
  return (
    <PrimaryButton
      {...props}
      style={[styles.button, status && styles.status, style]}
      textStyle={textStyle}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: sheetMetrics.action.height,
    borderRadius: sheetMetrics.action.radius,
    paddingHorizontal: sheetMetrics.action.horizontalPadding,
  },
  status: {
    height: sheetMetrics.action.statusHeight,
    borderRadius: sheetMetrics.action.statusRadius,
  },
});
