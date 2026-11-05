import { useId, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { inputProps } from '../../../theme/inputTheme';
import { typography } from '../../../theme';

const HEIGHT = 60;
const RADIUS = 20;

export function FeeRateInput({
  accessibilityLabel,
  value,
  onChangeText,
  color,
  editable,
}) {
  const input = useRef(null);
  const [width, setWidth] = useState(0);
  const focus = useSharedValue(0);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fillId = `${id}FeeFill`;
  const leftId = `${id}FeeLeft`;
  const topId = `${id}FeeTop`;
  const focusStyle = useAnimatedStyle(() => ({ opacity: focus.value * 0.08 }));

  return (
    <Pressable
      accessible={false}
      disabled={!editable}
      onPress={() => input.current?.focus()}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      style={styles.surface}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.focus, { backgroundColor: color }, focusStyle]}
      />
      {width > 0 && (
        <Svg
          width={width}
          height={HEIGHT}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <LinearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <Stop stopColor="white" stopOpacity={0.04} />
              <Stop offset="1" stopColor="white" stopOpacity={0.02} />
            </LinearGradient>
            <LinearGradient
              id={leftId}
              gradientUnits="userSpaceOnUse"
              x1={0.5}
              y1={31}
              x2={0.5}
              y2={20.5}
            >
              <Stop stopColor={color} stopOpacity={0} />
              <Stop offset="0.55" stopColor={color} stopOpacity={0.3} />
              <Stop offset="1" stopColor={color} stopOpacity={0.3} />
            </LinearGradient>
            <LinearGradient
              id={topId}
              gradientUnits="userSpaceOnUse"
              x1={0.5}
              y1={0.5}
              x2={width * 0.4}
              y2={0.5}
            >
              <Stop stopColor={color} stopOpacity={0.3} />
              <Stop offset="0.75" stopColor={color} stopOpacity={0.3} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={width}
            height={HEIGHT}
            rx={RADIUS}
            fill={`url(#${fillId})`}
          />
          <Path
            d="M0.5 31V20.5"
            stroke={`url(#${leftId})`}
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={`M0.5 20.5A20 20 0 0 1 20.5 0.5H${width * 0.4}`}
            stroke={`url(#${topId})`}
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      )}
      <View
        pointerEvents="none"
        style={[styles.dot, { backgroundColor: color }]}
      />
      <TextInput
        {...inputProps}
        ref={input}
        accessibilityLabel={accessibilityLabel}
        editable={editable}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          focus.value = withTiming(1, { duration: 180 });
        }}
        onBlur={() => {
          focus.value = withTiming(0, { duration: 180 });
        }}
        keyboardType="number-pad"
        onSubmitEditing={Keyboard.dismiss}
        placeholder="0"
        style={styles.input}
      />
      <Text style={styles.unit}>sat/vB</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    height: HEIGHT,
    borderRadius: RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  focus: { ...StyleSheet.absoluteFillObject, borderRadius: RADIUS },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 20 },
  input: {
    ...typography.feeValue,
    flex: 1,
    height: HEIGHT,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  unit: { ...typography.feeValue, color: '#FFFFFF80', paddingRight: 20 },
});
