import { useCallback, useEffect, useRef } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { BitholdMark } from '../../../components/branding/BitholdMark';
import {
  welcomeLayout,
  welcomeMotion,
  welcomePalette,
} from '../theme/welcomeLayout';

function IdentityPart({ from, to, origin, progress, children }) {
  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const x = from.x - origin.value.x;
    const y = from.y - origin.value.y;
    const currentWidth = from.width + (to.width - from.width) * p;
    const currentHeight = from.height + (to.height - from.height) * p;
    return {
      opacity: origin.value.measured ? 1 : 0,
      transform: [
        { translateX: x + (to.x - x) * p + (currentWidth - to.width) / 2 },
        { translateY: y + (to.y - y) * p + (currentHeight - to.height) / 2 },
        { scaleX: currentWidth / to.width },
        { scaleY: currentHeight / to.height },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.part,
        { width: to.width, height: to.height },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function WelcomeIdentity({ width, height, compact, progress }) {
  const ref = useRef(null);
  const started = useRef(false);
  const reducedMotion = useReducedMotion();
  const origin = useSharedValue({ x: 0, y: 0, measured: false });
  const scale = compact ? welcomeLayout.compactScale : 1;
  const markSize = welcomeLayout.markSize * scale;
  const fromMark = {
    x: (width - 105) / 2,
    y: (height - 105) / 2,
    width: 105,
    height: 105,
  };
  const onLayout = useCallback(() => {
    ref.current?.measureInWindow((x, y, measuredWidth) => {
      if (!measuredWidth) return;
      origin.value = { x, y, measured: true };
      if (!started.current) {
        started.current = true;
        progress.value = reducedMotion
          ? 1
          : withDelay(
              welcomeMotion.introHold,
              withSpring(1, { duration: 1000, dampingRatio: 1 }),
            );
      }
    });
  }, [origin, progress, reducedMotion]);

  useEffect(() => {
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reduced => {
        if (reduced) {
          cancelAnimation(progress);
          progress.value = 1;
        }
      },
    );
    return () => {
      subscription.remove();
      cancelAnimation(progress);
    };
  }, [progress]);

  return (
    <View
      ref={ref}
      collapsable={false}
      // VoiceOver still finds the screen's heading the wordmark gave it.
      accessible
      accessibilityRole="header"
      accessibilityLabel="Bithold"
      onLayout={onLayout}
      style={[
        {
          width: welcomeLayout.identityWidth * scale,
          // The mark alone: no "Bithold" wordmark under it.
          height: markSize,
        },
      ]}
    >
      <IdentityPart
        from={fromMark}
        to={{ x: 9 * scale, y: 0, width: markSize, height: markSize }}
        origin={origin}
        progress={progress}
      >
        <BitholdMark size={markSize} color={welcomePalette.text} />
      </IdentityPart>
    </View>
  );
}

const styles = StyleSheet.create({
  part: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
