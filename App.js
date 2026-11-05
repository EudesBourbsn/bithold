import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { WalletProvider } from './src/app/providers/WalletProvider';
import { AppNavigator } from './src/app/navigation/AppNavigator';
import { WalletLoaderProvider } from './src/app/providers/WalletLoaderProvider';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <WalletProvider>
          <WalletLoaderProvider>
            <AppNavigator />
          </WalletLoaderProvider>
        </WalletProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
