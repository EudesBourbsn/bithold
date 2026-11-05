import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { impactFeedback } from '../../../services/feedback';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
// The thumb's check mark (MaterialCommunityIcons "check"), in a deeper shade
// of the track's green so it reads on the white thumb.
const CHECK = 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z';
const CHECK_COLOR = '#00A30E';
export function PreferenceSwitch({
  label,
  value,
  onChange,
  disabled = false,
  dim = false,
}) {
  const position = useSharedValue(value ? 1 : 0);
  const press = useSharedValue(1);
  useEffect(() => {
    const easing = Easing.bezier(0.25, 0, 0.5, 1);
    position.value = withSequence(
      withTiming(value ? 1.1 : -0.1, { duration: 165, easing }),
      withTiming(value ? 1 : 0, { duration: 110, easing }),
    );
  }, [value, position]);
  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * 16 }, { scale: press.value }],
  }));
  // The mark fades in with the thumb's travel and is gone when off.
  const mark = useAnimatedStyle(() => ({
    opacity: Math.max(0, Math.min(1, position.value)),
  }));
  const track = useAnimatedProps(() => ({
    fill: interpolateColor(
      Math.max(0, Math.min(1, position.value)),
      [0, 1],
      ['#4B4B4B', '#00E013'],
    ),
  }));
  return (
    <Pressable
      disabled={disabled}
      accessibilityElementsHidden
      accessible={false}
      hitSlop={10}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      onPressIn={() => {
        press.value = withTiming(1.09, { duration: 110 });
      }}
      onPressOut={() => {
        press.value = withTiming(1, { duration: 165 });
      }}
      onPress={() => {
        if (disabled) {
          return;
        }
        impactFeedback();
        onChange(!value);
      }}
      style={[styles.hit, dim && styles.dimmed]}
    >
      <View style={styles.track}>
        <Svg width={56} height={28}>
          <Defs>
            <LinearGradient id="switch" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0" stopColor="#00E013" />
              <Stop offset="1" stopColor="#61E900" />
            </LinearGradient>
          </Defs>
          <AnimatedRect width={56} height={28} rx={14} animatedProps={track} />
          {value && <Rect width={56} height={28} rx={14} fill="url(#switch)" />}
          <Path
            d="M14 27.5A13.5 13.5 0 0 1 .5 14 13.5 13.5 0 0 1 14 .5h28A13.5 13.5 0 0 1 55.5 14"
            fill="none"
            stroke="#FFFFFF99"
          />
          <Path
            d="M42 .5A13.5 13.5 0 0 1 55.5 14 13.5 13.5 0 0 1 42 27.5H14A13.5 13.5 0 0 1 .5 14"
            fill="none"
            stroke="#FFFFFF59"
          />
        </Svg>
        <Animated.View style={[styles.thumb, thumb]}>
          <Animated.View style={mark}>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path d={CHECK} fill={CHECK_COLOR} />
            </Svg>
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  hit: {
    width: 56,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: { width: 56, height: 28 },
  dimmed: { opacity: 0.4 },
  thumb: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 36,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
