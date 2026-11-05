import { BackHeader } from '../../../components/sheets/BackHeader';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { PASSCODE_LENGTH } from '../../../wallet/services/WalletSecurity';
import { PasscodeBackground, headerInset } from '../components/PasscodeChrome';
import { Keypad, PasscodeDots } from '../components/PasscodePad';
import { fonts } from '../../../theme/fonts';

const STEPS = PASSCODE_LENGTH * 2;
// React Native's default Animated.spring (tension 40, friction 7).
const springTo = (value, toValue) =>
  Animated.spring(value, { toValue, useNativeDriver: true });

function ProgressLine({ state, width }) {
  const position = useRef(new Animated.Value(state)).current;
  useEffect(() => {
    springTo(position, state).start();
  }, [position, state]);
  // The fill's 13 states: -W + i·W/12 for i = 0…12, and a 14th at 0 that
  // keeps the spring from carrying it past the end.
  const translateX = position.interpolate({
    inputRange: [0, STEPS, STEPS + 1],
    outputRange: [-width, 0, 0],
  });
  return (
    <View style={[styles.track, { width }]}>
      <Animated.View
        style={[styles.fill, { width, transform: [{ translateX }] }]}
      />
    </View>
  );
}

function Heading({ shown, children, style }) {
  const state = useRef(new Animated.Value(shown ? 1 : 0)).current;
  useEffect(() => {
    springTo(state, shown ? 1 : 0).start();
  }, [shown, state]);
  return (
    <Animated.Text
      accessibilityRole="header"
      accessibilityElementsHidden={!shown}
      importantForAccessibility={shown ? 'auto' : 'no-hide-descendants'}
      allowFontScaling={false}
      style={[
        styles.heading,
        style,
        {
          opacity: state.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateY: state.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [-40, 0, 40],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.Text>
  );
}

export function CreatePasscodeScreen({ onCancel, onCreate, onCreated }) {
  const t = useT();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const top = headerInset(insets);
  const [state, setState] = useState({
    step: 0,
    passcode: '',
    confirmation: '',
  });
  const { step, passcode } = state;
  const mounted = useRef(true);
  const timer = useRef(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (passcode.length !== PASSCODE_LENGTH) {
      return;
    }
    if (step === 0) {
      setState({ step: 1, passcode: '', confirmation: passcode });
      return;
    }
    if (step !== 1) {
      return;
    }
    if (passcode !== state.confirmation) {
      setState({ step: 0, passcode: '', confirmation: '' });
      Alert.alert(t('passcode.failed'), t('passcode.mismatchRetry'));
      return;
    }
    // The passcode is saved while the 500 ms success pause runs.
    setState(previous => ({ ...previous, step: 2 }));
    const pause = new Promise(resolve => {
      timer.current = setTimeout(resolve, 500);
    });
    Promise.all([onCreate(passcode), pause]).then(
      () => {
        if (mounted.current) {
          onCreated();
        }
      },
      () => {
        if (!mounted.current) {
          return;
        }
        setState({ step: 0, passcode: '', confirmation: '' });
        Alert.alert(t('passcode.failed'), t('passcode.couldNotSet'));
      },
    );
  }, [passcode, step, state.confirmation, onCreate, onCreated, t]);
  const onKey = key => {
    impactFeedback();
    setState(previous => ({
      ...previous,
      passcode:
        key === 'backspace'
          ? previous.passcode.slice(0, -1)
          : previous.passcode + key,
    }));
  };
  const lineWidth = width - 40;
  return (
    <View style={styles.screen} accessibilityViewIsModal>
      <PasscodeBackground />
      <View style={styles.content}>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[styles.title, { top: top + 2 }]}
        >
          {t('passcode.secureWallet')}
        </Text>
        <View style={[styles.progress, { top: top + 42 }]}>
          <ProgressLine
            width={lineWidth}
            state={step === 0 ? passcode.length : passcode.length + 6}
          />
        </View>
        <View style={{ marginTop: top + 62 }}>
          <Heading shown={step === 0}>{t('passcode.create')}</Heading>
          <Heading shown={step !== 0} style={styles.confirm}>
            {t('passcode.confirm')}
          </Heading>
        </View>
        <PasscodeDots value={passcode} filled={step === 2} />
        <Keypad
          onKey={onKey}
          disabled={step === 2 || passcode.length === PASSCODE_LENGTH}
        />
        <BackHeader
          disabled={step === 2}
          onBack={() => {
            impactFeedback();
            onCancel?.();
          }}
          style={[styles.back, { top }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { ...StyleSheet.absoluteFill, backgroundColor: colors.background },
  content: { flex: 1, width: '100%', paddingHorizontal: 20 },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    ...fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.1,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  progress: {
    position: 'absolute',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  track: { height: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  fill: { position: 'absolute', height: 2, backgroundColor: '#FFFFFF' },
  heading: {
    ...fonts.semibold,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  confirm: { position: 'absolute', alignSelf: 'center' },
  back: { zIndex: 1 },
});
