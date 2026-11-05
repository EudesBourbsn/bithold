import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { welcomeMotion } from '../theme/welcomeLayout';

export function WelcomeEntrance({ index, children, style, handoff }) {
  const systemReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(systemReducedMotion);
  const progress = useSharedValue(systemReducedMotion ? 1 : 0);
  const measuredHeight = useSharedValue(0);
  const started = useSharedValue(false);

  useEffect(() => {
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducedMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(progress);
      progress.value = 1;
      return;
    }
    return () => cancelAnimation(progress);
  }, [progress, reducedMotion]);

  useAnimatedReaction(
    () => handoff.value,
    amount => {
      if (amount <= 0 || started.value) return;
      started.value = true;
      if (amount >= 1 || reducedMotion) {
        progress.value = 1;
      } else {
        progress.value = withDelay(
          welcomeMotion.delay + index * welcomeMotion.stagger,
          withTiming(1, {
            duration: welcomeMotion.duration,
            easing: Easing.bezier(...welcomeMotion.curve),
          }),
        );
      }
    },
    [handoff, index, reducedMotion],
  );

  const entranceStyle = useAnimatedStyle(() => {
    const remaining = 1 - progress.value;
    return {
      opacity: progress.value,
      transform: [
        {
          translateY:
            measuredHeight.value * welcomeMotion.riseFraction * remaining,
        },
        { scale: 1 - (1 - welcomeMotion.initialScale) * remaining },
      ],
    };
  });

  return (
    <Animated.View
      onLayout={event => {
        measuredHeight.value = event.nativeEvent.layout.height;
      }}
      style={[style, entranceStyle]}
    >
      {children}
    </Animated.View>
  );
}
