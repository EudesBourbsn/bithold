import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useT } from '../../../i18n/index';
import { colors, sheetMetrics, typography } from '../../../theme/index';
import { SettingsGlyph } from '../../settings/components/SettingsRow';

export function WarningIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Circle cx={10} cy={10} r={10} fill="#F38C47" />
      <Path
        d="M10 4.5v6.5m0 3v.2"
        stroke="#3E3126"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
export function RecoveryMethod({
  title,
  subtitle,
  icon,
  unprotected,
  protectedWithPasskey = false,
  onPress,
  descriptionGap = sheetMetrics.recovery.descriptionGap,
}) {
  const t = useT();
  // A method without an action is not available in this version: it keeps
  // its place in the design, dimmed and inert.
  const inactive = !onPress;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={[styles.recoveryRow, inactive && styles.inactive]}
    >
      <View style={styles.recoveryIcon}>
        <SettingsGlyph name={icon} />
      </View>
      <View style={styles.recoveryBody}>
        <View style={styles.recoveryHeading}>
          <Text style={typography.recoveryTitle}>{title}</Text>
          {protectedWithPasskey && (
            <View style={[styles.badge, styles.protectedBadge]}>
              <Text style={styles.protectedText}>
                {t('recovery.protected')}
              </Text>
            </View>
          )}
          {unprotected && !protectedWithPasskey && (
            <View style={styles.badge}>
              <WarningIcon />
              <Text style={styles.badgeText}>{t('recovery.notProtected')}</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            typography.sheetDescription,
            styles.recoverySubtitle,
            { marginTop: descriptionGap },
          ]}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  recoveryRow: {
    flexDirection: 'row',
    paddingHorizontal: sheetMetrics.recovery.horizontalInset,
    paddingVertical: sheetMetrics.recovery.verticalPadding,
  },
  recoveryIcon: { width: sheetMetrics.recovery.iconSlot, opacity: 0.4 },
  inactive: { opacity: 0.4 },
  recoveryBody: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  recoveryHeading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  recoverySubtitle: { textAlign: 'left', color: '#FFFFFFB8' },
  badge: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#F38C4729',
  },
  protectedBadge: {
    marginLeft: 'auto',
    backgroundColor: '#D9BC8226',
    paddingHorizontal: 10,
  },
  protectedText: { ...typography.label, lineHeight: 16, color: colors.gold },
  badgeText: { ...typography.label, lineHeight: 16, color: '#F38C47' },
});
