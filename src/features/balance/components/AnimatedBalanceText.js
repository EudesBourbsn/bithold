import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  balanceNumberMotion,
  digitPositions,
  layoutNumber,
  numberProgress,
} from '../motion/balanceNumberMotion';

const wheel = Array.from({ length: 20 }, (_, index) => String(index % 10));

function NumberGlyph({
  before,
  after,
  progress,
  increasing,
  textStyle,
  beforeScale,
  afterScale,
}) {
  const glyph = after ?? before;
  const from = before ?? { ...after, char: '0' };
  const to = after ?? before;
  const fontSize = textStyle.fontSize;
  const height = textStyle.lineHeight;
  const step = fontSize * balanceNumberMotion.stepHeightRatio;
  const roll = glyph.digit
    ? digitPositions(Number(from.char), Number(to.char), increasing, step)
    : { from: 0, to: 0 };
  const frameStyle = useAnimatedStyle(() => {
    const p = numberProgress(progress.value);
    return {
      left: from.x + (to.x - from.x) * p,
      width: from.width + (to.width - from.width) * p,
      opacity: !before ? p : !after ? 1 - p : 1,
    };
  });
  const contentStyle = useAnimatedStyle(() => {
    const p = numberProgress(progress.value);
    return {
      transform: [{ translateY: roll.from + (roll.to - roll.from) * p }],
    };
  });
  const scaleStyle = useAnimatedStyle(() => {
    const p = numberProgress(progress.value);
    const scale = beforeScale + (afterScale - beforeScale) * p;
    return {
      top: (height - step * scale) / 2,
      transform: [{ scale }],
    };
  });
  return (
    <Animated.View style={[styles.glyph, { height }, frameStyle]}>
      <Animated.View
        style={[styles.scale, { width: fontSize * 2 }, scaleStyle]}
      >
        <Animated.View style={contentStyle}>
          {(glyph.digit ? wheel : [glyph.char]).map((character, index) => (
            <Text
              key={index}
              allowFontScaling={false}
              style={[
                textStyle,
                styles.wheelText,
                { fontSize, lineHeight: step, height: step },
              ]}
            >
              {character}
            </Text>
          ))}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export function AnimatedBalanceText({ text, value, enabled, style }) {
  const textStyle = StyleSheet.flatten(style);
  const reducedMotion = useReducedMotion();
  const animate = enabled && !reducedMotion;
  const [width, setWidth] = useState(0);
  const [widths, setWidths] = useState({});
  const previous = useRef({ text, value });
  const [transition, setTransition] = useState(null);
  const progress = useSharedValue(1);
  const revision = useRef(0);
  const finish = useCallback(id => {
    if (revision.current === id) {
      setTransition(null);
    }
  }, []);
  const characters = useMemo(
    () => Array.from(new Set(`0123456789${text}`)),
    [text],
  );
  const nextLayout = useMemo(
    () =>
      width > 0
        ? layoutNumber(text, widths, textStyle.letterSpacing ?? 0, width)
        : null,
    [text, widths, width, textStyle.letterSpacing],
  );

  useLayoutEffect(() => {
    const old = previous.current;
    if (old.text === text) {
      if (!animate) {
        cancelAnimation(progress);
        progress.value = 1;
        setTransition(null);
      }
      return undefined;
    }
    const id = ++revision.current;
    previous.current = { text, value };
    cancelAnimation(progress);
    const before =
      width > 0
        ? layoutNumber(old.text, widths, textStyle.letterSpacing ?? 0, width)
        : null;
    if (
      !animate ||
      !before ||
      !nextLayout ||
      !Number.isFinite(old.value) ||
      !Number.isFinite(value)
    ) {
      progress.value = 1;
      setTransition(null);
      return undefined;
    }
    progress.value = 0;
    setTransition({
      before,
      after: nextLayout,
      increasing: value >= old.value,
    });
    progress.value = withDelay(
      balanceNumberMotion.delay,
      withTiming(
        1,
        {
          duration: balanceNumberMotion.duration,
          easing: Easing.linear,
        },
        finished => {
          if (finished) {
            scheduleOnRN(finish, id);
          }
        },
      ),
    );
    return undefined;
  }, [
    text,
    value,
    animate,
    nextLayout,
    progress,
    width,
    widths,
    textStyle.letterSpacing,
    finish,
  ]);

  useEffect(
    () => () => {
      revision.current += 1;
      cancelAnimation(progress);
    },
    [progress],
  );

  const pairs = transition
    ? new Map(transition.before.slots.map(slot => [slot.key, { before: slot }]))
    : null;
  transition?.after.slots.forEach(slot => {
    pairs.set(slot.key, { ...pairs.get(slot.key), after: slot });
  });
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      style={[styles.container, { height: textStyle.lineHeight }]}
    >
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.measurement}
      >
        {characters.map(character => (
          <Text
            key={character}
            allowFontScaling={false}
            style={[textStyle, styles.measurementGlyph]}
            onTextLayout={event => {
              const measured = event.nativeEvent.lines[0]?.width;
              if (measured > 0) {
                setWidths(current =>
                  current[character] === measured
                    ? current
                    : { ...current, [character]: measured },
                );
              }
            }}
          >
            {character}
          </Text>
        ))}
      </View>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {transition && animate ? (
          Array.from(pairs, ([key, pair]) => (
            <NumberGlyph
              key={key}
              {...pair}
              progress={progress}
              increasing={transition.increasing}
              textStyle={textStyle}
              beforeScale={transition.before.scale}
              afterScale={transition.after.scale}
            />
          ))
        ) : (
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={[style, styles.staticText]}
          >
            {text}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden' },
  scale: { transformOrigin: 'top left' },
  wheelText: { letterSpacing: 0 },
  glyph: { position: 'absolute', top: 0, overflow: 'hidden' },
  staticText: { textAlign: 'center' },
  measurement: { position: 'absolute', width: 2000, height: 2000, opacity: 0 },
  measurementGlyph: { position: 'absolute', letterSpacing: 0 },
});
