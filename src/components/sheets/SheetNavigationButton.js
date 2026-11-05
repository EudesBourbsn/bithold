import { Pressable, StyleSheet } from 'react-native';
import { useT } from '../../i18n/index';
import { sheetMetrics } from '../../theme/index';
import { navigationMetrics } from '../../theme/navigationMetrics';
import { BackGlyph, Icon } from '../icons/Icon';

export function SheetNavigationButton({
  icon = 'backArrow',
  label,
  onPress,
  disabled = false,
  size = sheetMetrics.header.iconSize,
  style,
}) {
  const t = useT();
  const isBack = icon === 'backArrow' || icon === 'back';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? t('common.back')}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={
        isBack ? navigationMetrics.backHitSlop : navigationMetrics.hitSlop
      }
      onPress={onPress}
      style={[styles.control, isBack && styles.back, style]}
    >
      {icon === 'backArrow' ? <BackGlyph /> : <Icon name={icon} size={size} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  control: {
    width: navigationMetrics.controlSize,
    height: navigationMetrics.controlSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    width: navigationMetrics.backIconSize,
    height: navigationMetrics.backIconSize,
  },
});
