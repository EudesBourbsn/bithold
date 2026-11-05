import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../../../theme/index';
import { styles } from '../styles/SettingsPreferences.styles.js';

// MaterialCommunityIcons "check", the Currency list's tick.
const CHECK = 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z';

function ListRow({ title, subtitle, selected, onPress, last }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{ selected, disabled: selected }}
      disabled={selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.listRow,
        !last && styles.listDivider,
        (selected || pressed) && styles.listDimmed,
      ]}
    >
      <View style={styles.choiceBody}>
        <Text style={[styles.listTitle, selected && styles.listTitleSelected]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.listSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {selected && (
        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          style={styles.listCheck}
        >
          <Path d={CHECK} fill={colors.foreground} />
        </Svg>
      )}
    </Pressable>
  );
}

const UNIT_SLOP = { top: 14, bottom: 14 };
function RadioRow({ title, subtitle, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{ checked: selected }}
      onPress={selected ? undefined : onPress}
      hitSlop={UNIT_SLOP}
      style={({ pressed }) => [
        styles.unitRow,
        subtitle && styles.unitRowTall,
        pressed && styles.unitPressed,
      ]}
    >
      <View style={styles.choiceBody}>
        <Text style={styles.unitTitle}>{title}</Text>
        {subtitle ? <Text style={styles.unitSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.unitMark, subtitle && styles.unitMarkTall]}>
        <Svg width={20} height={20} viewBox="0 0 20 20">
          <Circle
            cx={10}
            cy={10}
            r={9}
            fill="none"
            stroke={selected ? colors.button : colors.foreground}
            strokeWidth={2}
          />
          {selected && <Circle cx={10} cy={10} r={5} fill={colors.button} />}
        </Svg>
      </View>
    </Pressable>
  );
}

const TICK = 'M3.3 9.5L7.8 14.5L16.9 5';
function CheckRow({ title, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={title}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      hitSlop={UNIT_SLOP}
      style={({ pressed }) => [
        styles.unitRow,
        styles.unitCheckRow,
        pressed && styles.unitPressed,
      ]}
    >
      <View style={styles.choiceBody}>
        <Text style={styles.unitTitle}>{title}</Text>
      </View>
      <View style={[styles.unitCheck, selected && styles.unitCheckOn]}>
        {selected && (
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Path d={TICK} stroke={colors.modal} strokeWidth={2} fill="none" />
          </Svg>
        )}
      </View>
    </Pressable>
  );
}

export function SettingsSelectionRow({
  title,
  subtitle,
  selected,
  onPress,
  plain = false,
  radio = false,
  checkbox = false,
  last = false,
}) {
  if (radio) {
    return (
      <RadioRow
        title={title}
        subtitle={subtitle}
        selected={selected}
        onPress={onPress}
      />
    );
  }
  if (checkbox) {
    return <CheckRow title={title} selected={selected} onPress={onPress} />;
  }
  if (plain) {
    return (
      <ListRow
        title={title}
        subtitle={subtitle}
        selected={selected}
        onPress={onPress}
        last={last}
      />
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{
        selected,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        !subtitle && styles.choiceCompact,
        pressed && styles.choicePressed,
      ]}
    >
      <View style={styles.choiceBody}>
        <Text style={subtitle ? styles.choiceTitle : styles.choiceTitleCompact}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.choiceSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <Text style={styles.tick}>✓</Text>}
      </View>
    </Pressable>
  );
}
