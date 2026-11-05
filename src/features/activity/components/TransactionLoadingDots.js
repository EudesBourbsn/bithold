import { useEffect } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const PERIOD = 1800;
const STAGGER = 160;
const DOTS = [0, 1, 2];
const ease = Easing.bezierFn(0.42, 0, 0.58, 1);

function dotOpacity(elapsed, index) {
  'worklet';
  const phase = ((elapsed + (2 - index) * STAGGER) % PERIOD) / PERIOD;
  if (phase < 0.4) {
    return 0.4 + 0.6 * ease(phase / 0.4);
  }
  if (phase < 0.8) {
    return 1 - 0.6 * ease((phase - 0.4) / 0.4);
  }
  return 0.4;
}

function Dot({ clock, index, size, reducedMotion }) {
  const animation = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 0.7 : dotOpacity(clock.value, index),
  }));
  return (
    <Animated.View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2 },
        animation,
      ]}
    />
  );
}

export function TransactionLoadingDots({ size = 3 }) {
  const clock = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const update = state => {
      cancelAnimation(clock);
      clock.value = 0;
      if (state === 'active' && !reducedMotion) {
        clock.value = withRepeat(
          withTiming(PERIOD, { duration: PERIOD, easing: Easing.linear }),
          -1,
        );
      }
    };
    update(AppState.currentState);
    const subscription = AppState.addEventListener('change', update);
    return () => {
      subscription.remove();
      cancelAnimation(clock);
    };
  }, [clock, reducedMotion]);
  return (
    <View style={styles.row} accessible={false}>
      {DOTS.map(index => (
        <Dot
          key={index}
          clock={clock}
          index={index}
          size={size}
          reducedMotion={reducedMotion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2.5 },
  dot: { backgroundColor: '#D8D8D8' },
});
