import { useEffect, useRef } from 'react';
import {
  Animated as RNAnimated,
  Easing as RNEasing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { PASSCODE_LENGTH } from '../../../wallet/services/WalletSecurity';
import { fonts } from '../../../theme/fonts';

const KEY_INK = colors.foreground;

const SMALL_HEIGHT = 736;
export const isSmallHeight = height => height < SMALL_HEIGHT;

const KEY = 75;
const KEY_SPRING = { damping: 15, stiffness: 300 };
const keyFill = {
  rest: 'rgba(255, 255, 255, 0.08)',
  pressed: 'rgba(255, 255, 255, 0.14)',
  overshoot: 'rgba(255, 255, 255, 0.10)',
  // The un-animated base under the animated fill.
  base: 'rgba(255, 255, 255, 0.08)',
};
const KeyTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function Key({ label, onPress, disabled, isAnimated, placeholder, children }) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor:
      scale.value === 0.85
        ? keyFill.pressed
        : scale.value === 1.03
        ? keyFill.overshoot
        : keyFill.rest,
  }));
  return (
    <KeyTouchable
      accessible={!placeholder}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={14.25}
      onPress={() => {
        if (!disabled) {
          onPress?.();
        }
        if (isAnimated) {
          scale.value = withSequence(
            withSpring(0.85, KEY_SPRING),
            withSpring(1.03, KEY_SPRING),
            withSpring(1, KEY_SPRING),
          );
        }
      }}
      style={[styles.key, disabled && styles.disabled, isAnimated && animated]}
    >
      {children}
    </KeyTouchable>
  );
}

function BackspaceGlyph() {
  return (
    <Svg width={44} height={32} viewBox="0 0 44 32" accessible={false}>
      <Path
        d="M15 0H38a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H15L1.4 17.5a2.2 2.2 0 0 1 0-3Z"
        fill={KEY_INK}
      />
      <Path
        d="M20.4 9.9 32.6 22.1M32.6 9.9 20.4 22.1"
        stroke={colors.background}
        strokeWidth={3}
      />
    </Svg>
  );
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export function Keypad({
  onKey,
  disabled = false,
  isAnimated = true,
  extraKey,
  firstRowStyle,
  onBackspaceLongPress,
}) {
  const t = useT();
  const { height } = useWindowDimensions();
  const small = isSmallHeight(height);
  const press = key => () => onKey(key);
  const rowGap = { marginTop: small ? 5 : 15 };
  return (
    <>
      {ROWS.map((row, index) => (
        <View
          key={row[0]}
          style={[
            styles.row,
            index === 0
              ? [{ marginTop: small ? 20 : 50 }, firstRowStyle]
              : rowGap,
          ]}
        >
          {row.map(digit => (
            <Key
              key={digit}
              label={digit}
              disabled={disabled}
              isAnimated={isAnimated}
              onPress={press(digit)}
            >
              <Text allowFontScaling={false} style={styles.digit}>
                {digit}
              </Text>
            </Key>
          ))}
        </View>
      ))}
      <View style={[styles.row, rowGap]}>
        {extraKey ?? <Key disabled isAnimated={false} placeholder />}
        <Key
          label="0"
          disabled={disabled}
          isAnimated={isAnimated}
          onPress={press('0')}
        >
          <Text allowFontScaling={false} style={styles.digit}>
            0
          </Text>
        </Key>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('passcode.delete')}
          disabled={disabled}
          hitSlop={14.25}
          delayLongPress={5000}
          onLongPress={onBackspaceLongPress}
          onPress={() => {
            impactFeedback();
            onKey('backspace');
          }}
          style={[styles.key, styles.backspace, disabled && styles.disabled]}
        >
          <BackspaceGlyph />
        </TouchableOpacity>
      </View>
    </>
  );
}

// Passcode dots: six 13 pt dots; typed ones grow from 10/13 to full size
// over 400 ms (bezier 0.65, 0, 0.35, 1) and turn opaque at once; on success
// they stay blue. Leaving a full entry without success shakes the row
// (+20 in 200 ms, -10 in 300 ms, back in 300 ms).
const REST_SCALE = 10 / 13;
function Dot({ active, isAnimated }) {
  const scale = useRef(new RNAnimated.Value(REST_SCALE)).current;
  useEffect(() => {
    if (!isAnimated) {
      scale.setValue(1);
      return;
    }
    RNAnimated.timing(scale, {
      toValue: active ? 1 : REST_SCALE,
      duration: 400,
      easing: RNEasing.bezier(0.65, 0, 0.35, 1),
      useNativeDriver: true,
    }).start();
  }, [active, isAnimated, scale]);
  return (
    <RNAnimated.View
      style={[
        styles.dot,
        active ? styles.activeDot : styles.inactiveDot,
        { transform: [{ scale }] },
      ]}
    />
  );
}

export function PasscodeDots({
  value,
  filled = false,
  isAnimated = true,
  style,
}) {
  const t = useT();
  const { height } = useWindowDimensions();
  const shake = useRef(new RNAnimated.Value(0)).current;
  const previous = useRef(value.length);
  useEffect(() => {
    if (
      isAnimated &&
      previous.current === PASSCODE_LENGTH &&
      value.length < PASSCODE_LENGTH &&
      !filled
    ) {
      RNAnimated.sequence(
        [
          [20, 200],
          [-10, 300],
          [0, 300],
        ].map(([toValue, duration]) =>
          RNAnimated.timing(shake, {
            toValue,
            duration,
            useNativeDriver: true,
          }),
        ),
      ).start();
    }
    previous.current = value.length;
  }, [value, filled, isAnimated, shake]);
  return (
    <RNAnimated.View style={{ transform: [{ translateX: shake }] }}>
      <View
        accessible
        accessibilityLabel={t('passcode.progress', {
          count: value.length,
          total: PASSCODE_LENGTH,
        })}
        style={[
          styles.dots,
          isSmallHeight(height) ? styles.compactDots : styles.regularDots,
          style,
        ]}
      >
        {Array.from({ length: PASSCODE_LENGTH }, (_, index) => (
          <Dot
            key={index}
            active={filled || value.length > index}
            isAnimated={isAnimated}
          />
        ))}
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
  key: {
    width: KEY,
    height: KEY,
    borderRadius: KEY / 2,
    marginHorizontal: 14.25,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: keyFill.base,
  },
  backspace: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  digit: {
    ...fonts.regular,
    fontSize: 36,
    letterSpacing: 0,
    color: KEY_INK,
    textAlign: 'center',
  },
  dots: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center' },
  compactDots: { marginTop: 30 },
  regularDots: { marginTop: 60 },
  activeDot: { backgroundColor: colors.button, opacity: 1 },
  inactiveDot: { backgroundColor: colors.foreground, opacity: 0.25 },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    marginHorizontal: 13,
    overflow: 'hidden',
  },
});
