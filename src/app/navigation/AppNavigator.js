import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { useWallets } from '../providers/WalletProvider';
import { useWalletLoader } from '../providers/WalletLoaderProvider';
import { AppBackground } from '../../components/backgrounds/AppBackground';
import { BitholdMark } from '../../components/branding/BitholdMark';
import { BalanceScreen } from '../../features/balance/screens/BalanceScreen';
import { ImportWalletScreen } from '../../features/importWallet/screens/ImportWalletScreen';
import { OnboardingScreen } from '../../features/onboarding/screens/OnboardingScreen';
import { navigationRef } from './navigationRef';
import { colors } from '../../theme/colors';

const Stack = createNativeStackNavigator();
const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background },
};
const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: colors.background },
};

export function AppNavigator() {
  const { ready, walletCount } = useWallets();
  const loader = useWalletLoader();
  const [foregroundSession, setForegroundSession] = useState(0);
  const wasBackgrounded = useRef(AppState.currentState === 'background');
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'background') {
        wasBackgrounded.current = true;
      } else if (state === 'active' && wasBackgrounded.current) {
        wasBackgrounded.current = false;
        loader.exit();
        setForegroundSession(session => session + 1);
      }
    });
    return () => subscription.remove();
  }, [loader]);
  if (!ready) {
    return (
      <View style={styles.startup}>
        <AppBackground />
        <BitholdMark size={105} color={colors.foreground} />
      </View>
    );
  }
  return (
    <NavigationContainer
      key={foregroundSession}
      ref={navigationRef}
      theme={theme}
    >
      <Stack.Navigator
        initialRouteName={walletCount > 0 ? 'Balance' : 'Onboarding'}
        screenOptions={screenOptions}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Balance" component={BalanceScreen} />
        <Stack.Screen
          name="ImportWallet"
          component={ImportWalletScreen}
          options={
            Platform.OS === 'ios'
              ? {
                  headerShown: true,
                  title: '',
                  // The page background's first colour, where the content's
                  // gradient starts below it.
                  headerStyle: { backgroundColor: '#313352' },
                  headerTintColor: '#FFFFFF',
                  headerShadowVisible: false,
                  headerBackVisible: true,
                  headerBackButtonDisplayMode: 'minimal',
                }
              : undefined
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  startup: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
