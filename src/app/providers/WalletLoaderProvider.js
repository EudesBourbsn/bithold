import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Spinner } from '../../components/loading/Spinner';
import { colors } from '../../theme/index';
import { AppBackground } from '../../components/backgrounds/AppBackground';
import { fonts } from '../../theme/fonts';

const TITLE_MAX_WIDTH = (300 * 290.8) / 316.4;
const FADE = { duration: 200 };

const WalletLoaderContext = createContext(null);

export function WalletLoaderProvider({ children }) {
  const [title, setTitle] = useState(null);
  const opacity = useSharedValue(0);
  const generation = useRef(0);
  const unmount = useCallback(current => {
    if (current === generation.current) {
      setTitle(null);
    }
  }, []);
  const enter = useCallback(
    message => {
      generation.current += 1;
      setTitle(message);
      opacity.value = withTiming(1, FADE);
    },
    [opacity],
  );
  const exit = useCallback(() => {
    const current = generation.current;
    opacity.value = withTiming(0, FADE, finished => {
      if (finished) {
        scheduleOnRN(unmount, current);
      }
    });
  }, [opacity, unmount]);
  const value = useMemo(() => ({ enter, exit }), [enter, exit]);
  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <WalletLoaderContext.Provider value={value}>
      {children}
      {title != null && (
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <AppBackground />
          <View style={styles.stack}>
            <Spinner size={64} color={colors.button} />
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
          </View>
        </Animated.View>
      )}
    </WalletLoaderContext.Provider>
  );
}

export function useWalletLoader() {
  return useContext(WalletLoaderContext);
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
  },
  stack: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    maxWidth: TITLE_MAX_WIDTH,
    ...fonts.medium,
    fontSize: 30,
    lineHeight: 36,
    color: colors.foreground,
    textAlign: 'center',
  },
});
