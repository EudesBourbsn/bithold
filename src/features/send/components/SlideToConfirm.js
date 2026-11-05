import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import { useSheetScrollGesture } from '../../../components/sheets/SheetGestureContext';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { styles } from '../styles/SlideToConfirm.styles.js';

export function SlideToConfirm({ onConfirmed }) {
  const t = useT();
  const nativeScroll = useSheetScrollGesture();
  const [width, setWidth] = useState(0),
    [busy, setBusy] = useState(false);
  const position = useRef(new Animated.Value(0)).current,
    value = useRef(0),
    touchStartX = useRef(0),
    blocked = useRef(false),
    hint = useRef(null),
    mounted = useRef(true);
  const maxSlide = Math.max(0, width - 8),
    travel = Math.max(0, maxSlide - 80);
  useEffect(() => {
    const id = position.addListener(({ value: next }) => {
      value.current = next;
    });
    return () => position.removeListener(id);
  }, [position]);
  useEffect(
    () => () => {
      mounted.current = false;
      hint.current?.stop();
      position.stopAnimation();
    },
    [position],
  );
  useEffect(() => {
    if (!width || blocked.current) {
      return;
    }
    const easeIn = Easing.bezier(0.42, 0, 1, 1),
      easeBoth = Easing.bezier(0.42, 0, 0.58, 1);
    const cycle = () =>
      Animated.sequence([
        Animated.timing(position, {
          toValue: maxSlide * 0.02,
          duration: 250,
          easing: Easing.out(easeIn),
          useNativeDriver: false,
        }),
        Animated.timing(position, {
          toValue: -maxSlide * 0.005,
          duration: 250,
          easing: easeBoth,
          useNativeDriver: false,
        }),
        Animated.timing(position, {
          toValue: 0,
          duration: 600,
          easing: easeBoth,
          useNativeDriver: false,
        }),
        Animated.delay(800),
      ]);
    hint.current = Animated.sequence([
      Animated.delay(2000),
      ...Array.from(
        {
          length: 5,
        },
        cycle,
      ),
    ]);
    hint.current.start();
    return () => hint.current?.stop();
  }, [width, maxSlide, position]);
  const finish = useRef(() => {});
  finish.current = cancelled => {
    if (cancelled || value.current <= maxSlide * 0.5) {
      Animated.spring(position, {
        toValue: 0,
        mass: 1,
        stiffness: 100,
        damping: 10,
        overshootClamping: true,
        useNativeDriver: false,
      }).start();
      return;
    }
    setBusy(true);
    Animated.spring(position, {
      toValue: travel,
      mass: 1,
      stiffness: 100,
      damping: 10,
      overshootClamping: true,
      useNativeDriver: false,
    }).start(async ({ finished }) => {
      if (!finished || !mounted.current) {
        return;
      }
      impactFeedback();
      await onConfirmed();
      if (!mounted.current) {
        return;
      }
      Animated.spring(position, {
        toValue: 0,
        mass: 1,
        stiffness: 100,
        damping: 10,
        overshootClamping: true,
        useNativeDriver: false,
      }).start(() => {
        if (mounted.current) {
          setBusy(false);
        }
      });
    });
  };
  const moveThumb = translation => {
    const next = Math.max(0, Math.min(travel, translation));
    value.current = next;
    position.setValue(next);
  };
  const pan = usePanGesture({
    block: nativeScroll,
    runOnJS: true,
    enabled: !busy,
    hitSlop: {
      left: 0,
      width: 88,
    },
    activeOffsetX: 4,
    failOffsetY: [-8, 8],
    onBegin: event => {
      touchStartX.current = event.absoluteX;
    },
    onActivate: () => {
      blocked.current = true;
      hint.current?.stop();
      position.stopAnimation();
      position.setValue(0);
    },
    onUpdate: event => moveThumb(event.absoluteX - touchStartX.current),
    onDeactivate: event => {
      moveThumb(event.absoluteX - touchStartX.current);
      finish.current(event.canceled);
    },
  });
  const offset = position.interpolate({
    inputRange: [0, Math.max(1, travel)],
    outputRange: [0, Math.max(1, travel)],
    extrapolate: 'clamp',
  });
  const fill = Animated.add(offset, 80),
    opacity = position.interpolate({
      inputRange: [0, Math.max(1, travel)],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });
  return (
    <GestureDetector gesture={pan}>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel={t('slide.label')}
        accessibilityActions={[
          {
            name: 'increment',
          },
        ]}
        onAccessibilityAction={event => {
          if (event.nativeEvent.actionName === 'increment' && !busy) {
            blocked.current = true;
            hint.current?.stop();
            position.setValue(travel);
            finish.current(false);
          }
        }}
        onLayout={e => setWidth(e.nativeEvent.layout.width)}
        style={styles.track}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.fill,
            {
              width: fill,
            },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.labelRow,
            {
              opacity,
            },
          ]}
        >
          <Text style={styles.label}>{t('slide.label')}</Text>
          <Svg width={30} height={16} viewBox="0 0 30 16">
            <Path
              d="m2 2 6 6-6 6"
              fill="none"
              stroke={colors.onButton}
              strokeWidth={2}
              opacity={0.48}
            />
            <Path
              d="m17 2 6 6-6 6"
              fill="none"
              stroke={colors.onButton}
              strokeWidth={2}
              opacity={0.8}
            />
          </Svg>
        </Animated.View>
        <Animated.View
          accessibilityLabel={t('slide.handleLabel')}
          style={[
            styles.thumb,
            {
              left: Animated.add(offset, 4),
            },
            busy && styles.busy,
          ]}
        >
          {[0, 1, 2].map(n => (
            <View key={n} style={styles.grip} />
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
