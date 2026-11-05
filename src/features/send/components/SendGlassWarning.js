import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { selectionFeedback } from '../../../services/feedback';
import { sendFeedbackColors } from '../styles/sendFeedback';
import { fonts } from '../../../theme/fonts';

const timing = { duration: 250, easing: Easing.out(Easing.cubic) };
const layout = LinearTransition.duration(250).easing(Easing.out(Easing.cubic));

function ErrorIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={11} fill={sendFeedbackColors.icon} />
      <Path
        d="M12 10v7M12 6v1"
        stroke={sendFeedbackColors.background}
        strokeWidth={2.3}
      />
    </Svg>
  );
}

function ChevronDownSmall() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 10L11.2929 13.2929C11.6834 13.6834 12.3166 13.6834 12.7071 13.2929L16 10"
        stroke={sendFeedbackColors.icon}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SendGlassWarning({ message, collapsedLines = 2 }) {
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const progress = useSharedValue(0);
  useEffect(() => {
    setExpanded(false);
    progress.value = withTiming(0, timing);
  }, [message, progress]);
  const chevron = useAnimatedStyle(() => ({
    transform: [{ rotate: `${180 * (1 - progress.value)}deg` }],
  }));
  const toggle = () => {
    selectionFeedback();
    setExpanded(open => {
      progress.value = withTiming(open ? 0 : 1, timing);
      return !open;
    });
  };
  return (
    <Pressable
      accessibilityRole={overflows ? 'button' : undefined}
      accessibilityState={overflows ? { expanded } : undefined}
      disabled={!overflows}
      onPress={toggle}
    >
      <Animated.View
        layout={layout}
        style={[styles.card, { width: width - 40 }]}
      >
        <View pointerEvents="none" style={[styles.arc, styles.topArc]} />
        <View pointerEvents="none" style={[styles.arc, styles.bottomArc]} />
        <View style={styles.row}>
          {overflows ? (
            <Animated.View style={[styles.icon, chevron]}>
              <ChevronDownSmall />
            </Animated.View>
          ) : (
            <View style={styles.icon}>
              <ErrorIcon />
            </View>
          )}
          <View style={styles.text}>
            <Text
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              pointerEvents="none"
              onTextLayout={({ nativeEvent }) =>
                setOverflows(nativeEvent.lines.length > collapsedLines)
              }
              style={[styles.message, styles.measure]}
            >
              {message}
            </Text>
            <Text
              numberOfLines={expanded ? undefined : collapsedLines}
              style={styles.message}
            >
              {message}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minWidth: 258,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: sendFeedbackColors.background,
  },
  arc: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 24,
    borderColor: sendFeedbackColors.outline,
  },
  topArc: { top: 0, right: -2, bottom: -2, left: 0, opacity: 0.16 },
  bottomArc: { top: -2, right: 0, bottom: 0, left: -2, opacity: 0.12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexShrink: 1,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  message: {
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: sendFeedbackColors.text,
  },
  measure: {
    position: 'absolute',
    width: '100%',
    opacity: 0,
  },
});
