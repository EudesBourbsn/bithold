import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { fonts } from '../../../theme/fonts';

export const glyphUnits = (text, advances) =>
  Array.from(text).reduce((sum, char) => sum + (advances?.[char] ?? 0), 0);
export const digitWidth = (text, size, advances) =>
  glyphUnits(text, advances) * size - text.length * 0.02 * size;
function Digit({ digit, text, fontSize, target, advances, onExit }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration: 300,
        easing: t => {
          'worklet';
          const c = Math.cos((t * Math.PI) / 2);
          return 1 - c * c * c * Math.cos(t * Math.PI);
        },
      },
      finished => {
        if (finished && digit.exiting) {
          scheduleOnRN(onExit, digit.id);
        }
      },
    );
  }, [digit.exiting, digit.id, onExit, progress]);
  const prefix = digit.exiting ? digit.prefix : text.slice(0, digit.position);
  const units = glyphUnits(prefix, advances);
  const animated = useAnimatedStyle(() => {
    const eased = progress.value;
    return {
      left: units * fontSize.value - prefix.length * 0.02 * target,
      fontSize: fontSize.value,
      lineHeight: (fontSize.value * 105) / 88,
      letterSpacing: -0.02 * target,
      opacity: Math.max(0, Math.min(1, digit.exiting ? 1 - eased : eased)),
      transform: [
        { translateY: digit.exiting ? -50 * eased : -50 * (1 - eased) },
      ],
    };
  });
  return (
    <Animated.Text style={[styles.digit, animated]}>
      {digit.character}
    </Animated.Text>
  );
}
export function AnimatedAmountDigits({ text, fontSize, target, advances }) {
  const nextId = useRef(0),
    previous = useRef(text);
  const [digits, setDigits] = useState(() =>
    Array.from(text, (character, position) => ({
      id: nextId.current++,
      character,
      position,
      exiting: false,
      prefix: '',
    })),
  );
  const exit = React.useCallback(
    id => setDigits(items => items.filter(d => d.id !== id)),
    [],
  );
  useEffect(() => {
    if (previous.current === text) {
      return;
    }
    const old = previous.current;
    previous.current = text;
    setDigits(items => {
      const result = items.map(d =>
        !d.exiting && text[d.position] !== d.character
          ? { ...d, exiting: true, prefix: old.slice(0, d.position) }
          : d,
      );
      Array.from(text).forEach((character, position) => {
        if (
          !result.some(
            d =>
              !d.exiting &&
              d.position === position &&
              d.character === character,
          )
        ) {
          result.push({
            id: nextId.current++,
            character,
            position,
            exiting: false,
            prefix: '',
          });
        }
      });
      return result;
    });
  }, [text]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {digits.map(digit => (
        <Digit
          key={digit.id}
          digit={digit}
          text={text}
          fontSize={fontSize}
          target={target}
          advances={advances}
          onExit={exit}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  digit: {
    position: 'absolute',
    top: 0,
    ...fonts.semibold,
    color: 'white',
  },
});
