import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PRESSED_SCALE = 0.96;
const timing = { duration: 110 };

export function ScalePressable({ style, onPressIn, onPressOut, ...props }) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <AnimatedPressable
      {...props}
      style={[style, pressStyle]}
      onPressIn={event => {
        scale.value = withTiming(PRESSED_SCALE, timing);
        onPressIn?.(event);
      }}
      onPressOut={event => {
        scale.value = withTiming(1, timing);
        onPressOut?.(event);
      }}
    />
  );
}
