import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { LockProvider } from '../../features/security/providers/LockProvider';
import {
  setDisplayUnit,
  setFixedPrecision,
} from '../../features/send/domain/amount';
import { t, useLanguage } from '../../i18n/index';
import { setHapticEnabled } from '../../services/feedback';
import { playSound, setSoundEnabled } from '../../services/sound';
import { createReceiveSoundListener } from '../../services/receiveSound';
import { walletEngine } from '../../wallet/platform/nativeWallet';

const WalletContext = createContext(null);
export const walletError = error =>
  Alert.alert(
    t('wallet.alertTitle'),
    error?.message ?? t('error.operationFailed'),
  );
export function WalletProvider({ children }) {
  useLanguage();
  const [state, setState] = useState(() => walletEngine.view());
  useEffect(() => {
    const unsubscribe = walletEngine.subscribe(() => {
      const next = walletEngine.view();
      setState(next);
      setHapticEnabled(next.preferences.haptic);
      setSoundEnabled(next.preferences.sounds);
      setDisplayUnit(next.preferences.unit);
      setFixedPrecision(next.preferences.fixedPrecision);
    });
    setSoundEnabled(walletEngine.view().preferences.sounds);
    setDisplayUnit(walletEngine.view().preferences.unit);
    setFixedPrecision(walletEngine.view().preferences.fixedPrecision);
    const stopReceiveSound = walletEngine.onActivity(
      createReceiveSoundListener(playSound),
    );
    walletEngine.load().catch(walletError);
    return () => {
      unsubscribe();
      stopReceiveSound();
      walletEngine.setActive(false).catch(() => {});
    };
  }, []);
  const selectedWallet = state.wallets.find(w => w.id === state.selectedId);
  // Test networks' coins have no price.
  const quote =
    state.network === 'Mainnet'
      ? state.market.quotes[state.preferences.currency] ?? null
      : null;
  return (
    <WalletContext.Provider
      value={{
        ...state,
        selectedWallet,
        quote,
        engine: walletEngine,
        createWallet: () => walletEngine.create({ synchronize: true }),
        importWallet: (input, options) =>
          walletEngine.add(input, options, { synchronize: true }),
        selectWallet: id => walletEngine.select(id).catch(walletError),
        updateWallet: (id, changes) =>
          walletEngine.update(id, changes).catch(walletError),
        removeWallet: id => walletEngine.remove(id),
        clearWallets: options => walletEngine.clear(options),
        setPreference: (key, value) =>
          walletEngine.preference(key, value).catch(walletError),
        refresh: () =>
          selectedWallet
            ? walletEngine.refresh(selectedWallet.id, { force: true })
            : Promise.resolve(),
      }}
    >
      <LockProvider>{children}</LockProvider>
    </WalletContext.Provider>
  );
}
export const useWallets = () => useContext(WalletContext);
export function finishWalletEntry(navigation) {
  const hasBalance = navigation
    .getState()
    .routes.some(route => route.name === 'Balance');
  if (hasBalance) {
    navigation.popTo('Balance');
  } else {
    navigation.reset({ index: 0, routes: [{ name: 'Balance' }] });
  }
}
