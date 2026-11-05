import { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import Svg, { Path } from 'react-native-svg';
import { useT } from '../../../i18n/index';
import { styles } from '../styles/CloudBackupSheet.styles.js';

export function BackupStatusPill({ shown, status }) {
  const t = useT();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const visibility = useSharedValue(0);
  const success = useSharedValue(0);
  const [mounted, setMounted] = useState(shown);
  useEffect(() => {
    if (shown) {
      setMounted(true);
    }
    // Gone from the window once it has slid away, so it never takes touches.
    visibility.value = withSpring(
      shown ? 1 : 0,
      { mass: 1, damping: 17, stiffness: 170 },
      finished => {
        if (finished && !shown) {
          runOnJS(setMounted)(false);
        }
      },
    );
  }, [shown, visibility]);
  useEffect(() => {
    success.value = withTiming(status === 'finished' ? 1 : 0);
  }, [status, success]);
  // iOS has no live regions: say each state aloud.
  useEffect(() => {
    if (shown) {
      AccessibilityInfo.announceForAccessibility(
        status === 'finished' ? t('backup.created') : t('backup.creating'),
      );
    }
  }, [shown, status, t]);
  const bar = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, visibility.value)),
    transform: [
      { translateY: (1 - visibility.value) * -(insets.top + 60) },
      { scale: 0.9 + 0.1 * visibility.value },
    ],
  }));
  const tint = useAnimatedStyle(() => ({ opacity: success.value }));
  if (!mounted) {
    return null;
  }
  const finished = status === 'finished';
  const pill = (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.liquid,
        { top: insets.top + 4, maxWidth: width * 0.8 },
        bar,
      ]}
    >
      <View style={[StyleSheet.absoluteFill, styles.liquidBase]} />
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.liquidSuccess, tint]}
      />
      <View style={styles.liquidRow}>
        <Text numberOfLines={1} style={styles.liquidText}>
          {finished ? t('backup.created') : t('backup.creating')}
        </Text>
        <View style={styles.liquidIndicator}>
          {finished ? (
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path
                d="M6 12.5L10 16.5L18 8.5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <ActivityIndicator size="small" color="#FFFFFF" />
          )}
        </View>
      </View>
    </Animated.View>
  );
  return Platform.OS === 'ios' ? (
    <FullWindowOverlay unstable_accessibilityContainerViewIsModal={false}>
      {pill}
    </FullWindowOverlay>
  ) : (
    pill
  );
}
