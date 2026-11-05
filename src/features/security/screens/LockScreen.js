import { BackHeader } from '../../../components/sheets/BackHeader';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { BitholdMark } from '../../../components/branding/BitholdMark';
import { NativeSymbol } from '../../../components/icons/Icon';
import { useT } from '../../../i18n/index';
import { TemplateText } from '../../../i18n/TemplateText';
import {
  impactFeedback,
  notificationFeedback,
} from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { PASSCODE_LENGTH } from '../../../wallet/services/WalletSecurity';
import { GradientAction } from '../components/GradientAction';
import {
  PasscodeBackground,
  headerInset,
  heightClass,
  safeBottom,
  safeTop,
} from '../components/PasscodeChrome';
import { Keypad, PasscodeDots } from '../components/PasscodePad';
import { fonts } from '../../../theme/fonts';

function formatRemaining(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function Fade({ show, offset, style, children }) {
  const animated = useAnimatedStyle(() => ({
    opacity: withTiming(show ? 1 : 0, { duration: 500 }),
    transform: [
      { translateY: withTiming(show ? 0 : offset, { duration: 500 }) },
    ],
  }));
  return (
    <Animated.View
      pointerEvents={show ? 'auto' : 'none'}
      accessibilityElementsHidden={!show}
      importantForAccessibility={show ? 'auto' : 'no-hide-descendants'}
      style={[style, animated]}
    >
      {children}
    </Animated.View>
  );
}

function FaceIdGlyph() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" accessible={false}>
      <Path
        d="M1 7V4a3 3 0 0 1 3-3h3M17 1h3a3 3 0 0 1 3 3v3M23 17v3a3 3 0 0 1-3 3h-3M7 23H4a3 3 0 0 1-3-3v-3M7.5 8v2M16.5 8v2M12.5 8v4.5h-1M8 16.5c2.2 2.4 5.8 2.4 8 0"
        fill="none"
        stroke="#FCFBE7"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LockScreen({
  faceId,
  passcodeOnly = false,
  allowCancel = false,
  coldStart = false,
  onCancel,
  onUnlocked,
  onForgot,
}) {
  const t = useT();
  const { engine } = useWallets();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const size = heightClass(height);
  const [code, setCode] = useState('');
  const [filled, setFilled] = useState(false);
  const [busy, setBusy] = useState(false);
  const clearing = useRef(false);
  const [remaining, setRemaining] = useState(() => engine.passcodeLockout());
  const [invalid, setInvalid] = useState(false);
  const [forgot, setForgot] = useState(() => engine.passcodeLockout() > 0);
  const [faceIdUsable, setFaceIdUsable] = useState(faceId && !passcodeOnly);
  const [biometryType, setBiometryType] = useState(null);
  const mounted = useRef(true);
  const prompting = useRef(false);
  const bioFailed = useRef(false);
  const timers = useRef([]);
  useEffect(() => {
    mounted.current = true;
    const pending = timers.current;
    return () => {
      mounted.current = false;
      pending.forEach(clearTimeout);
    };
  }, []);
  const locked = remaining > 0;
  useEffect(() => {
    if (!locked) {
      return;
    }
    const timer = setInterval(() => {
      engine
        .tickPasscodeLockout(1000)
        .then(left => {
          if (!mounted.current) {
            return;
          }
          setRemaining(left);
          if (left <= 0) {
            setForgot(false);
          }
        })
        .catch(() => {});
    }, 1000);
    return () => clearInterval(timer);
  }, [locked, engine]);
  const succeed = useCallback(() => {
    setFilled(true);
    notificationFeedback('success');
    onUnlocked();
  }, [onUnlocked]);
  const wrong = useCallback(
    (entered, error) => {
      setFilled(false);
      clearing.current = true;
      for (let index = entered.length; index >= 1; index--) {
        const timer = setTimeout(() => {
          if (!mounted.current) {
            return;
          }
          setCode(entered.slice(0, index - 1));
          if (index === 1) {
            clearing.current = false;
          }
        }, (entered.length - index) * 100);
        timers.current.push(timer);
      }
      notificationFeedback('error');
      if (error?.code === 'lockout' || error?.remaining) {
        setInvalid(false);
        setForgot(true);
        setRemaining(error.remaining);
        AccessibilityInfo.announceForAccessibility(t('lock.lockedOut'));
        return;
      }
      setInvalid(true);
      if (error?.attempts === 2) {
        setForgot(true);
      }
      AccessibilityInfo.announceForAccessibility(t('lock.wrongPasscode'));
    },
    [t],
  );
  const validate = async entered => {
    setBusy(true);
    try {
      await engine.verifyPasscode(entered);
      if (mounted.current) {
        succeed();
      }
    } catch (error) {
      if (mounted.current) {
        wrong(entered, error);
      }
    } finally {
      if (mounted.current) {
        setBusy(false);
      }
    }
  };
  const onKey = key => {
    if (clearing.current || busy || locked) {
      return;
    }
    impactFeedback();
    const next = key === 'backspace' ? code.slice(0, -1) : code + key;
    setCode(next);
    if (next.length === PASSCODE_LENGTH) {
      requestAnimationFrame(() => validate(next));
    }
  };
  const promptFaceId = useCallback(async () => {
    if (prompting.current || !faceIdUsable) {
      return;
    }
    prompting.current = true;
    try {
      const biometry = await engine.biometry();
      if (!mounted.current) {
        return;
      }
      setBiometryType(biometry.type);
      if (engine.security.enrolmentChanged(biometry.domainState)) {
        setFaceIdUsable(false);
        await engine.setFaceId(false);
        Alert.alert(t('lock.passcodeRequired'), t('lock.enrolmentChanged'));
        return;
      }
      if (!biometry.available) {
        setFaceIdUsable(false);
        return;
      }
      await engine.authenticateFaceId(t('lock.faceIdReason'));
      await engine.clearPasscodeAttempts().catch(() => {});
      if (mounted.current) {
        succeed();
      }
    } catch (error) {
      if (mounted.current && error?.code !== 'cancelled') {
        bioFailed.current = true;
        notificationFeedback('error');
      }
    } finally {
      prompting.current = false;
    }
  }, [engine, faceIdUsable, succeed, t]);
  const promptRef = useRef(promptFaceId);
  promptRef.current = promptFaceId;
  useEffect(() => {
    if (!faceIdUsable) {
      return;
    }
    engine
      .biometry()
      .then(value => mounted.current && setBiometryType(value.type))
      .catch(() => {});
    // At a cold start iOS reports 'inactive' until launch finishes, so the
    // screen can arrive before the app is active; its first prompt then waits
    // for the first 'active', whatever state came before it.
    let waiting = AppState.currentState !== 'active';
    if (!waiting) {
      promptRef.current();
    }
    let previous = AppState.currentState;
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && waiting) {
        waiting = false;
        promptRef.current();
      } else if (previous === 'background' && state === 'active') {
        if (bioFailed.current) {
          bioFailed.current = false;
        } else {
          promptRef.current();
        }
      }
      previous = state;
    });
    return () => subscription.remove();
  }, [faceIdUsable, engine]);
  const biometryLabel = biometryType === 'touchID' ? 'Touch ID' : 'Face ID';
  const disableFaceId = () =>
    Alert.alert(
      t('lock.disableBiometryTitle', { biometry: biometryLabel }),
      t('lock.disableBiometryMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('lock.disable'),
          style: 'destructive',
          onPress: () => {
            setFaceIdUsable(false);
            engine.setFaceId(false).catch(() => {});
          },
        },
      ],
    );
  const messageOffset = size === 'default' ? 20 : 15;
  const showEnter = !invalid && !locked;
  return (
    <View style={styles.screen} accessibilityViewIsModal>
      <PasscodeBackground />
      <View style={[styles.column, { paddingTop: safeTop(insets, 20) }]}>
        <View style={styles.center}>
          <View style={styles.logo}>
            <BitholdMark size={40} />
          </View>
          <Text
            accessibilityRole="header"
            allowFontScaling={false}
            style={styles.title}
          >
            {t('lock.securedWallet')}
          </Text>
          <View style={styles.messages}>
            <Fade show={showEnter} offset={messageOffset}>
              <Text allowFontScaling={false} style={styles.message}>
                {t('lock.enterYourPasscode')}
              </Text>
            </Fade>
            <Fade
              show={invalid && !locked}
              offset={messageOffset}
              style={styles.overlay}
            >
              <Text allowFontScaling={false} style={styles.message}>
                {t('lock.wrongPasscode')}
              </Text>
            </Fade>
            <Fade show={locked} offset={messageOffset} style={styles.overlay}>
              <Text
                allowFontScaling={false}
                style={[styles.message, styles.waitMessage]}
              >
                {t('lock.lockedOut')}
              </Text>
            </Fade>
          </View>
        </View>
        <PasscodeDots
          value={code}
          filled={filled}
          style={size === 'default' ? styles.regularDots : styles.compactDots}
        />
        <Keypad
          onKey={onKey}
          disabled={filled || code.length === PASSCODE_LENGTH || locked}
          firstRowStyle={
            size === 'default' ? styles.regularKeypad : styles.compactKeypad
          }
          onBackspaceLongPress={coldStart ? onForgot : undefined}
          extraKey={
            faceIdUsable && biometryType ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={biometryLabel}
                hitSlop={14.25}
                delayLongPress={5000}
                onLongPress={disableFaceId}
                onPress={() => {
                  impactFeedback();
                  promptFaceId();
                }}
                style={styles.biometryKey}
              >
                {biometryType === 'touchID' ? (
                  <NativeSymbol
                    symbolName="touchid"
                    pointSize={24}
                    tintColor="#FCFBE7"
                    style={styles.touchId}
                  />
                ) : (
                  <FaceIdGlyph />
                )}
              </TouchableOpacity>
            ) : undefined
          }
        />
        <View style={styles.spacer} />
        <View
          style={[
            styles.bottom,
            { paddingBottom: safeBottom(insets, 60) + 20 },
          ]}
        >
          <Fade show={locked} offset={messageOffset}>
            <TemplateText
              allowFontScaling={false}
              style={styles.retry}
              text={t('lock.retryIn')}
              slots={{
                time: (
                  <Text style={styles.retryTime}>
                    {formatRemaining(remaining)}
                  </Text>
                ),
              }}
            />
          </Fade>
          <Fade show={forgot} offset={messageOffset}>
            <GradientAction
              label={t('lock.forgotYourPasscode')}
              width={250}
              disabled={!forgot}
              onPress={onForgot}
            />
          </Fade>
        </View>
      </View>
      {allowCancel && (
        <BackHeader
          onBack={() => {
            impactFeedback();
            onCancel?.();
          }}
          style={[styles.back, { top: headerInset(insets) }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    backgroundColor: colors.background,
  },
  regularDots: { marginTop: 60 },
  compactDots: { marginTop: 20 },
  regularKeypad: { marginTop: 50 },
  compactKeypad: { marginTop: 20 },
  column: { flex: 1 },
  center: { alignItems: 'center' },
  logo: { marginTop: 5 },
  title: {
    marginTop: 15,
    ...fonts.semibold,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  messages: { alignItems: 'center', marginTop: 5 },
  overlay: { position: 'absolute' },
  message: {
    alignSelf: 'center',
    width: 220,
    marginTop: 10,
    ...fonts.regular,
    fontSize: 16,
    letterSpacing: 0,
    color: '#BBBBBB',
    textAlign: 'center',
  },
  waitMessage: { width: 375 },
  biometryKey: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    marginHorizontal: 14.25,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.004)',
  },
  touchId: { width: 24, height: 24 },
  spacer: { flex: 1, minHeight: 10 },
  bottom: { alignItems: 'center' },
  retry: {
    alignSelf: 'center',
    marginBottom: 10,
    ...fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 0.58)',
    textAlign: 'center',
  },
  retryTime: { color: '#FFFFFF' },
  back: { zIndex: 1 },
});
