import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useT } from '../../i18n/index';
import { colors } from '../../theme/index';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function Spinner({ size = 64, color = colors.gold }) {
  const t = useT();
  const strokeWidth = size * 0.1;
  const radius = Math.max(0, (size - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const containerRotation = useSharedValue(0);
  const circleProgress = useSharedValue(0);
  useEffect(() => {
    containerRotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false,
    );
    circleProgress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(containerRotation);
      cancelAnimation(circleProgress);
    };
  }, [containerRotation, circleProgress]);
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${containerRotation.value}deg` }],
  }));
  const circleProps = useAnimatedProps(() => {
    const progress = circleProgress.value;
    const shortDash = circumference * 0.99;
    const longDash = circumference * 0.27;
    let dashOffset;
    if (progress <= 0.25) {
      dashOffset = shortDash;
    } else if (progress <= 0.5) {
      dashOffset = interpolate(progress, [0.25, 0.5], [shortDash, longDash]);
    } else if (progress <= 0.75) {
      dashOffset = longDash;
    } else {
      dashOffset = interpolate(progress, [0.75, 1], [longDash, shortDash]);
    }
    return { strokeDashoffset: dashOffset };
  });
  const circleStyle = useAnimatedStyle(() => {
    const progress = circleProgress.value;
    let circleRotation;
    if (progress <= 0.25) {
      circleRotation = 0;
    } else if (progress <= 0.5) {
      circleRotation = interpolate(progress, [0.25, 0.5], [0, 45]);
    } else if (progress <= 0.75) {
      circleRotation = 45;
    } else {
      circleRotation = interpolate(progress, [0.75, 1], [45, 360]);
    }
    return { transform: [{ rotate: `${circleRotation}deg` }] };
  });
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t('common.loading')}
      style={[styles.box, { width: size, height: size }]}
    >
      <Animated.View style={containerStyle}>
        <Animated.View style={circleStyle}>
          <Svg width={size} height={size}>
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animatedProps={circleProps}
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { justifyContent: 'center', alignItems: 'center' },
});
