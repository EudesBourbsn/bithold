import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { selectionFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

function Chevron() {
  return (
    <Svg width={8} height={14} viewBox="0 0 8 14" accessible={false}>
      <Path
        d="M0.92 0.83L6.83 7L0.92 13.17"
        stroke={colors.secondary}
        strokeWidth={1.83}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function WalletMethodList({
  rows,
  onSelect,
  disabledId,
  iconColor,
  iconOpacity,
}) {
  return (
    <View style={styles.list}>
      {rows.map(({ id, title, description, Icon }) => (
        <Pressable
          key={id}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityHint={description}
          accessibilityState={{ disabled: id === disabledId }}
          disabled={id === disabledId}
          onPress={() => {
            selectionFeedback();
            onSelect(id);
          }}
          style={({ pressed }) => [
            styles.row,
            pressed && styles.pressed,
            id === disabledId && styles.disabled,
          ]}
        >
          <View style={iconOpacity != null && { opacity: iconOpacity }}>
            <Icon color={iconColor} />
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <Chevron />
        </Pressable>
      ))}
    </View>
  );
}

const ROW_PADDING = 33.25 / 2;
const styles = StyleSheet.create({
  list: { paddingTop: 18 - ROW_PADDING, paddingBottom: 24 - ROW_PADDING },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    paddingVertical: ROW_PADDING,
  },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.6 },
  text: { flex: 1, marginLeft: 12, marginRight: 16 },
  title: {
    ...fonts.semibold,
    fontSize: 17,
    lineHeight: 22,
    color: colors.foreground,
  },
  description: {
    marginTop: 2.75,
    ...fonts.regular,
    fontSize: 14,
    lineHeight: 16,
    color: colors.secondary,
  },
});
