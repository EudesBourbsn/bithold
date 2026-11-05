import { Pressable, StyleSheet, Text } from 'react-native';
import { useT } from '../../i18n/index';
import { buttonMetrics, colors, typography } from '../../theme/index';

export function PrimaryButton({
  label,
  disabled = false,
  onPress,
  style,
  textStyle,
}) {
  const t = useT();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: disabled ? colors.neutralButton : colors.button },
        style,
        buttonMetrics.primary,
      ]}
    >
      <Text
        style={[
          typography.button,
          { color: disabled ? colors.secondary : colors.onButton },
          textStyle,
        ]}
      >
        {label ?? t('common.continue')}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    ...buttonMetrics.primary,
    borderRadius: 25,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
