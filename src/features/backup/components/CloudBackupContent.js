import { useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { SecurityBackground } from '../../security/components/SecurityBackground';
import { styles } from '../styles/CloudBackupSheet.styles.js';
import { ProtectArt, ProtectedArt, WarningArt } from './BackupIllustrations';
import { fonts } from '../../../theme/fonts';

const TITLE = {
  ...fonts.semibold,
  fontSize: 25,
  lineHeight: 30,
  letterSpacing: -0.25,
  color: '#FFFFFF',
  textAlign: 'center',
};

const SUBTITLE = {
  ...fonts.medium,
  fontSize: 14,
  lineHeight: 18,
  color: 'rgba(255, 255, 255, 0.72)',
  textAlign: 'center',
};

const MESSAGE_SPRING = {
  mass: 1,
  stiffness: 90,
  damping: 14,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const FADE = { duration: 300, easing: Easing.bezier(0.65, 0, 0.35, 1) };

function Rising({ children, style, delay = 100 }) {
  const rise = useSharedValue(80);
  const opacity = useSharedValue(0);
  useEffect(() => {
    rise.value = withSpring(0, MESSAGE_SPRING);
    opacity.value = withDelay(delay, withTiming(1, FADE));
  }, [rise, opacity, delay]);
  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: rise.value }],
  }));
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}

function WhitePill({ label, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        impactFeedback();
        onPress();
      }}
      style={[styles.pill, disabled && styles.dimmed]}
    >
      <Text allowFontScaling={false} style={styles.pillLabel}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function BackupPrompt({
  title,
  subtitle,
  label,
  onPress,
  disabled,
  icon,
}) {
  const { height } = useWindowDimensions();
  return (
    <Animated.View entering={FadeIn} style={styles.layout}>
      {icon ?? <ProtectArt height={height < 736 ? 96 : 112} />}
      <Rising style={styles.message}>
        <Text accessibilityRole="header" style={TITLE}>
          {title}
        </Text>
        {!!subtitle && <Text style={SUBTITLE}>{subtitle}</Text>}
      </Rising>
      <Rising delay={200} style={styles.buttons}>
        <WhitePill label={label} onPress={onPress} disabled={disabled} />
      </Rising>
    </Animated.View>
  );
}

export function BackupProtectedContent() {
  const t = useT();
  return (
    <View style={styles.protected}>
      <SecurityBackground />
      <ProtectedArt />
      <Rising style={styles.protectedMessage}>
        <Text accessibilityRole="header" style={TITLE}>
          {t('cloud.protectedTitle')}
        </Text>
        <Text style={SUBTITLE}>{t('cloud.protectedDescription')}</Text>
      </Rising>
    </View>
  );
}

export function BackupFailureContent({ message, onDone }) {
  const t = useT();
  return (
    <Animated.View entering={FadeIn} style={styles.error}>
      <View style={styles.errorContent}>
        <View style={styles.errorArt}>
          <WarningArt />
        </View>
        <View style={styles.errorBlock}>
          <Text accessibilityRole="header" style={TITLE}>
            {t('cloudRestore.errorTitle')}
          </Text>
          {!!message && (
            <Text style={[SUBTITLE, styles.errorMessage]}>{message}</Text>
          )}
        </View>
      </View>
      <View style={styles.errorFooter}>
        <WhitePill label={t('common.ok')} onPress={onDone} />
      </View>
    </Animated.View>
  );
}
