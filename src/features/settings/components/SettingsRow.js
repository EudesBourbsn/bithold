import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors, sheetMetrics, typography } from '../../../theme/index';
import { settingsIcons } from './settingsIcons';

export { SheetHeader as SettingsHeader } from '../../../components/sheets/SheetHeader';

export function SettingsGlyph({ name, size = 24 }) {
  return <SvgXml xml={settingsIcons[name]} width={size} height={size} />;
}

export function SettingsRow({
  title,
  value,
  icon,
  glyph,
  onPress,
  trailing,
  subtitle,
  label,
  toggleValue,
  disabled = false,
  dim = false,
  accessibilityHint,
}) {
  return (
    <View style={styles.row}>
      <Pressable
        disabled={disabled}
        accessibilityHint={accessibilityHint}
        accessibilityRole={
          toggleValue != null ? 'switch' : onPress ? 'button' : undefined
        }
        accessibilityState={
          toggleValue != null
            ? { checked: toggleValue, disabled }
            : { disabled }
        }
        accessibilityLabel={label}
        onPress={onPress}
        style={[styles.content, dim && styles.dimmed]}
      >
        <View style={styles.iconSlot}>
          {glyph ?? <SettingsGlyph name={icon} />}
        </View>
        <View style={styles.titleSlot}>
          <Text style={typography.settingsRow}>{title}</Text>
          {subtitle && (
            <Text style={[typography.sheetRowSubtitle, styles.subtitle]}>
              {subtitle}
            </Text>
          )}
        </View>
        {value != null && (
          <Text style={[typography.settingsRow, styles.value]}>{value}</Text>
        )}
        {trailing ??
          (onPress && (
            <View style={styles.chevron}>
              <SettingsGlyph name="chevron_right" />
            </View>
          ))}
      </Pressable>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingBottom: sheetMetrics.row.separation },
  content: {
    paddingHorizontal: sheetMetrics.row.horizontalInset,
    paddingBottom: sheetMetrics.row.paddingBottom,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSlot: {
    width: sheetMetrics.row.iconSlot,
    height: sheetMetrics.row.iconSize,
    paddingRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  titleSlot: { flex: 1 },
  dimmed: { opacity: 0.4 },
  subtitle: { marginTop: 0, opacity: 0.8 },
  value: { maxWidth: '48%', color: colors.secondary, marginLeft: 12 },
  chevron: { opacity: 0.4 },
  divider: {
    height: 1,
    marginLeft: 60,
    marginRight: 20,
    backgroundColor: colors.divider,
  },
});
