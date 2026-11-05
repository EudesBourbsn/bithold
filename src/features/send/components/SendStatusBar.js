import { Canvas, Fill, RadialGradient } from '@shopify/react-native-skia';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
  cancelAnimation,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';
import { NativeBlurMaterial as Material } from '../../../components/materials/NativeBlurMaterial';
import { useT } from '../../../i18n/index';
import { colors } from '../../../theme/index';
import { styles } from '../styles/SendStatusBar.styles.js';
import { sendCompletionMotion as metrics } from './sendCompletionMotion';

function ProgressRing() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, [rotation]);
  const spin = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));
  const circumference = 2 * Math.PI * 8;
  return (
    <Animated.View style={spin}>
      <Svg width={20} height={20}>
        <Circle
          cx={10}
          cy={10}
          r={8}
          fill="none"
          stroke="#FFFFFF33"
          strokeWidth={2}
        />
        {Array.from(
          {
            length: 40,
          },
          (_, index) => (
            <Circle
              key={index}
              cx={10}
              cy={10}
              r={8}
              fill="none"
              stroke={colors.foreground}
              strokeWidth={2}
              strokeOpacity={(index + 1) / 40}
              strokeDasharray={[(circumference * 0.9) / 40, circumference]}
              rotation={index * 8.1}
              origin="10, 10"
            />
          ),
        )}
      </Svg>
    </Animated.View>
  );
}
function StatusContent({ status, measuring = false, maximumWidth }) {
  return (
    <View
      style={[
        styles.content,
        {
          maxWidth: maximumWidth,
        },
      ]}
    >
      <Text numberOfLines={1} style={styles.text}>
        {status.text}
      </Text>
      <View style={styles.indicator}>
        {!measuring && (
          <Animated.View
            key={status.phase}
            entering={FadeInDown.springify().damping(12).stiffness(120)}
            exiting={FadeOutDown}
          >
            {status.phase === 'finished' ? (
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="m7 13 3 3 7-8"
                  stroke={colors.foreground}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            ) : (
              <ProgressRing />
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}
export function SendStatusBar({ status, onComplete }) {
  const t = useT();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [displayed, setDisplayed] = useState(status);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const current = useRef(status);
  const completion = useRef(onComplete);
  const scale = useSharedValue(0);
  const barWidth = useSharedValue(0);
  const success = useSharedValue(0);
  const maximumWidth = Math.min(
    width * metrics.maximumWidthFraction,
    width - metrics.contentWidthReservation,
  );
  completion.current = onComplete;
  const hidden = useCallback(id => {
    if (current.current?.id !== id) {
      return;
    }
    const finished = current.current.phase === 'finished';
    current.current = null;
    setDisplayed(null);
    setMeasuredWidth(0);
    if (finished) {
      completion.current(id);
    }
  }, []);
  const dismiss = useCallback(() => {
    const id = current.current?.id;
    if (id == null) {
      return;
    }
    scale.value = withSpring(0, metrics.barSpring, finished => {
      if (finished) {
        scheduleOnRN(hidden, id);
      }
    });
  }, [hidden, scale]);
  useEffect(() => {
    if (!status) {
      dismiss();
      return;
    }
    const newPayment = current.current?.id !== status.id;
    current.current = status;
    setDisplayed(status);
    if (newPayment) {
      setMeasuredWidth(0);
      scale.value = 0;
      success.value = 0;
    }
    success.value = withTiming(status.phase === 'finished' ? 1 : 0);
    if (status.phase === 'finished') {
      const timeout = setTimeout(dismiss, metrics.successDuration);
      return () => clearTimeout(timeout);
    }
  }, [status, dismiss, scale, success]);
  useEffect(() => {
    if (measuredWidth > 0 && current.current) {
      barWidth.value = withTiming(measuredWidth, {
        duration: 50,
      });
      scale.value = withSpring(1, metrics.barSpring);
    }
  }, [measuredWidth, barWidth, scale]);
  useEffect(
    () => () => {
      cancelAnimation(scale);
      cancelAnimation(barWidth);
      cancelAnimation(success);
    },
    [scale, barWidth, success],
  );
  const container = useAnimatedStyle(() => ({
    width: barWidth.value,
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));
  const pending = useAnimatedStyle(() => ({
    opacity: 1 - success.value,
  }));
  const finished = useAnimatedStyle(() => ({
    opacity: success.value,
  }));
  const rightCap = useDerivedValue(() => ({
    x: barWidth.value + 6,
    y: -6,
  }));
  if (!displayed) {
    return null;
  }
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        key={displayed.id}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.measure}
      >
        <View
          onLayout={event => setMeasuredWidth(event.nativeEvent.layout.width)}
        >
          <StatusContent
            status={displayed}
            measuring
            maximumWidth={maximumWidth}
          />
        </View>
      </View>
      <View
        style={[
          styles.position,
          {
            top: insets.top - 4,
          },
        ]}
      >
        <Animated.View
          accessible
          accessibilityRole="alert"
          accessibilityLabel={t(
            displayed.phase === 'finished'
              ? 'send.sentLabel'
              : 'send.sendingLabel',
            { amount: displayed.amount },
          )}
          accessibilityLiveRegion="polite"
          style={[styles.bar, container]}
        >
          <Material style={StyleSheet.absoluteFill} />
          <Animated.View style={[styles.pending, pending]} />
          <Animated.View style={[styles.success, finished]}>
            <Canvas style={StyleSheet.absoluteFill}>
              <Fill>
                <RadialGradient
                  c={{
                    x: -6,
                    y: 54,
                  }}
                  r={38.4}
                  colors={['#FFFFFF26', '#FFFFFF00']}
                />
              </Fill>
              <Fill>
                <RadialGradient
                  c={rightCap}
                  r={38.4}
                  colors={['#FFFFFF26', '#FFFFFF00']}
                />
              </Fill>
            </Canvas>
          </Animated.View>
          <StatusContent status={displayed} maximumWidth={maximumWidth} />
        </Animated.View>
      </View>
    </View>
  );
}
