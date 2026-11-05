import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useT } from '../../../i18n/index';
import { colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';
import { refreshMotion } from '../motion/refreshMotion';

export function BalanceRefreshHint({ scrollOffset, running, armed, compact }) {
  const t = useT();
  const reveal = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [-refreshMotion.threshold, 0],
      [1, 0],
      'clamp',
    ),
  }));
  const pull = useAnimatedStyle(() => ({
    opacity: !running.value && !armed.value ? 1 : 0,
  }));
  const release = useAnimatedStyle(() => ({
    opacity: !running.value && armed.value ? 1 : 0,
  }));
  const updating = useAnimatedStyle(() => ({ opacity: running.value ? 1 : 0 }));

  return (
    <Animated.View
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.hint, compact ? styles.compact : styles.regular, reveal]}
    >
      <Svg width={14} height={10} viewBox="0 0 14 10">
        <Path
          d="M1.77 4.776a1.067 1.067 0 0 0-1.466 0 .97.97 0 0 0 0 1.41L3.97 9.707c.406.39 1.066.39 1.47-.003l8.26-8.007a.97.97 0 0 0-.007-1.41 1.067 1.067 0 0 0-1.467.007L4.7 7.591 1.77 4.776z"
          fill={colors.button}
        />
      </Svg>
      <View style={styles.labels}>
        <Animated.Text allowFontScaling={false} style={[styles.title, pull]}>
          {t('balance.pullToRefresh')}
        </Animated.Text>
        <Animated.Text allowFontScaling={false} style={[styles.title, release]}>
          {t('balance.releaseToRefresh')}
        </Animated.Text>
        <Animated.Text
          allowFontScaling={false}
          style={[styles.title, updating]}
        >
          {t('balance.updating')}
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  hint: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -16 }],
  },
  regular: { top: -50 },
  compact: { top: -40 },
  labels: { alignSelf: 'stretch', height: 20, marginTop: 10 },
  title: {
    ...fonts.medium,
    color: colors.foreground,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
  },
});
