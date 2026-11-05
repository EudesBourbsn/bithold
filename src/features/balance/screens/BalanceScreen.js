import { useIsFocused } from '@react-navigation/native';
import { BalanceHeaderActions } from '../components/BalanceHeaderActions';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useWalletLoader } from '../../../app/providers/WalletLoaderProvider';
import { useWallets } from '../../../app/providers/WalletProvider';
import { ScalePressable } from '../../../components/buttons/ScalePressable';
import { Icon } from '../../../components/icons/Icon';
import { SheetPresentationContext } from '../../../components/sheets/SheetPresentation';
import {
  requestSheet,
  dismissSheet,
} from '../../../components/sheets/sheetSelection';
import { useT } from '../../../i18n/index';
import { selectionFeedback } from '../../../services/feedback';
import { typography } from '../../../theme/index';
import { TransactionsSheet } from '../../activity/sheets/TransactionsSheet';
import { ReceiveBitcoinSheet } from '../../receive/sheets/ReceiveBitcoinSheet';
import { bitcoinText, fiat as formatFiat } from '../../send/domain/amount';
import { SendBitcoinSheet } from '../../send/sheets/SendBitcoinSheet';
import { AppSettingsSheet } from '../../settings/sheets/AppSettingsSheet';
import { ManageWalletsSheet } from '../../wallet/sheets/ManageWalletsSheet';
import { WalletSettingsSheet } from '../../wallet/sheets/WalletSettingsSheet';
import { BalanceGlow } from '../components/BalanceGlow';
import { AppBackground } from '../../../components/backgrounds/AppBackground';
import { BalanceRefreshHint } from '../components/BalanceRefreshHint';
import { BalanceRefreshRipple } from '../components/BalanceRefreshRipple';
import { AnimatedBalanceText } from '../components/AnimatedBalanceText';
import { BitcoinPriceCard } from '../components/BitcoinPriceCard';
import { useBalanceRefresh } from '../hooks/useBalanceRefresh';
import { styles } from '../styles/BalanceScreen.styles.js';

function HiddenBalance({ fiat = false }) {
  return (
    <View
      style={[
        styles.hiddenRow,
        fiat ? styles.fiatHiddenHeight : styles.bitcoinHiddenHeight,
      ]}
    >
      <Text
        style={[
          styles.hiddenPrefix,
          fiat ? styles.fiatHiddenPrefix : styles.bitcoinHiddenPrefix,
        ]}
      >
        {fiat ? '$' : '₿'}
      </Text>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={[styles.dot, fiat ? styles.fiatDot : styles.bitcoinDot]}
        />
      ))}
    </View>
  );
}
export function BalanceScreen({ navigation }) {
  const t = useT();
  const {
    selectedWallet,
    preferences,
    clearWallets,
    createWallet,
    quote,
    refresh,
  } = useWallets();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const [viewport, setViewport] = useState({ width, height });
  const [settingsWalletId, setSettingsWalletId] = useState(null);
  // Settings' Back Up Now opens a wallet's backup methods.
  const [settingsWalletStep, setSettingsWalletStep] = useState('info');
  const afterManagement = useRef(null);
  const loader = useWalletLoader();
  useEffect(() => {
    if (!focused) {
      return undefined;
    }
    const frame = requestAnimationFrame(loader.exit);
    return () => cancelAnimationFrame(frame);
  }, [focused, loader]);
  const handoffManagement = action => {
    afterManagement.current = {
      action,
      requestKey: setActiveSheet(null),
    };
  };
  const creating = useRef(false);
  // The onboarding "Create new wallet" flow, from the balance screen: the new
  // wallet is selected once it is made.
  const createNewWallet = async () => {
    if (creating.current) {
      return;
    }
    creating.current = true;
    loader.enter(t('onboarding.creating'));
    try {
      await createWallet();
      requestAnimationFrame(loader.exit);
    } catch (error) {
      loader.exit();
      Alert.alert(t('onboarding.createFailed'), error.message);
    } finally {
      creating.current = false;
    }
  };
  const onManagementDismissed = () => {
    const pending = afterManagement.current;
    afterManagement.current = null;
    if (
      pending &&
      selectionRef.current.name === null &&
      selectionRef.current.requestKey === pending.requestKey
    ) {
      pending.action();
    }
  };
  const resetToOnboarding = async () => {
    try {
      await clearWallets({ force: true });
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Onboarding',
          },
        ],
      });
    } catch (error) {
      Alert.alert(t('balance.resetFailed'), error.message);
    }
  };
  const [hidden, setHidden] = useState(false);
  const [sheetSelection, setSheetSelection] = useState({
    name: null,
    requestKey: 0,
  });
  const selectionRef = useRef(sheetSelection);
  const scrollView = useRef(null);
  const activeSheet = sheetSelection.name;
  const setActiveSheet = name => {
    const next = requestSheet(selectionRef.current, name);
    selectionRef.current = next;
    setSheetSelection(next);
    return next.requestKey;
  };
  const closeActionSheet = (name, requestKey) => {
    const next = dismissSheet(selectionRef.current, name, requestKey);
    if (next !== selectionRef.current) {
      selectionRef.current = next;
      setSheetSelection(next);
    }
  };
  const scrollOffset = useSharedValue(0);
  const { onScroll, progress, running, armed, motionEnabled, motionRefs } =
    useBalanceRefresh({
      enabled: focused && activeSheet == null,
      animationEnabled: preferences.animation,
      scrollOffset,
      viewport,
      onRefresh: () =>
        refresh().catch(error =>
          Alert.alert(t('balance.refreshFailed'), error.message),
        ),
    });
  return (
    <Animated.View
      ref={motionRefs.root}
      collapsable={false}
      style={styles.screen}
      onLayout={({ nativeEvent: { layout } }) =>
        setViewport(previous =>
          previous.width === layout.width && previous.height === layout.height
            ? previous
            : { width: layout.width, height: layout.height },
        )
      }
    >
      <StatusBar barStyle="light-content" />
      <AppBackground />
      <BalanceGlow
        scrollOffset={scrollOffset}
        sheetOpen={activeSheet != null}
        animated={preferences.animation}
      />
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <Animated.ScrollView
          ref={scrollView}
          onScroll={onScroll}
          alwaysBounceVertical
          bounces
          contentInsetAdjustmentBehavior="never"
          scrollEnabled={activeSheet == null}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top,
            },
          ]}
        >
          <View>
            <BalanceRefreshHint
              scrollOffset={scrollOffset}
              running={running}
              armed={armed}
              compact={height < 736}
            />
            <View style={styles.toolbar}>
              <BalanceHeaderActions
                animated={motionEnabled}
                activityRef={motionRefs.activity}
                settingsRef={motionRefs.settings}
                onActivity={() => {
                  selectionFeedback();
                  setActiveSheet('activity');
                }}
                onSettings={() => {
                  selectionFeedback();
                  setActiveSheet('settings');
                }}
              />
            </View>
            <View style={styles.content}>
              <Pressable
                accessibilityLabel={
                  hidden ? t('balance.hiddenLabel') : t('balance.shownLabel')
                }
                onLongPress={() => {
                  selectionFeedback();
                  setHidden(v => !v);
                }}
                style={styles.balanceGroup}
              >
                {hidden ? (
                  <HiddenBalance fiat />
                ) : (
                  <AnimatedBalanceText
                    key={`${selectedWallet?.id}:${preferences.currency}`}
                    enabled={motionEnabled}
                    value={
                      selectedWallet?.snapshot && quote
                        ? (selectedWallet.snapshot.balance / 100000000) * quote
                        : null
                    }
                    text={
                      selectedWallet?.snapshot && quote
                        ? formatFiat(
                            (selectedWallet.snapshot.balance / 100000000) *
                              quote,
                            preferences.currency,
                          )
                        : '\u00a0'
                    }
                    style={typography.fiatBalance}
                  />
                )}
                <View style={styles.amountGap} />
                {hidden ? (
                  <HiddenBalance />
                ) : (
                  <AnimatedBalanceText
                    key={`${selectedWallet?.id}:${preferences.unit}:${preferences.fixedPrecision}`}
                    enabled={motionEnabled}
                    value={selectedWallet?.snapshot?.balance ?? null}
                    text={
                      selectedWallet?.snapshot
                        ? preferences.unit === 'sats'
                          ? `${selectedWallet.snapshot.balance.toLocaleString(
                              'en-US',
                            )} sats`
                          : `₿${bitcoinText(selectedWallet.snapshot.balance)}`
                        : '\u00a0'
                    }
                    style={typography.balance}
                  />
                )}
              </Pressable>
              <ScalePressable
                onPress={() => {
                  selectionFeedback();
                  setActiveSheet('wallets');
                }}
                accessibilityRole="button"
                accessibilityLabel={t('balance.walletSelector')}
                style={styles.walletNameRow}
              >
                <Text numberOfLines={1} style={typography.walletName}>
                  {selectedWallet?.name ??
                    t('wallet.defaultName', { number: 1 })}
                </Text>
                <Icon name="chevron" size={18} />
              </ScalePressable>
              <View style={styles.marketGap} />
              <BitcoinPriceCard />
              <View style={styles.actions}>
                {[
                  [t('balance.receive'), 'receive'],
                  [t('balance.send'), 'send'],
                ].map(([label, icon]) => (
                  <View
                    key={icon}
                    ref={motionRefs[icon]}
                    collapsable={false}
                    style={styles.actionMotion}
                  >
                    <ScalePressable
                      accessibilityRole="button"
                      onPress={() => {
                        selectionFeedback();
                        // No wallet on the active network yet: Manage wallets
                        // offers Add wallet.
                        setActiveSheet(selectedWallet ? icon : 'wallets');
                      }}
                      style={styles.action}
                    >
                      <View style={styles.actionIcon}>
                        <Icon name={icon} size={23} />
                      </View>
                      <Text style={typography.control}>{label}</Text>
                    </ScalePressable>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
      {motionEnabled && (
        <BalanceRefreshRipple
          progress={progress}
          width={viewport.width}
          height={viewport.height}
        />
      )}
      <SheetPresentationContext.Provider value="inline">
        <ManageWalletsSheet
          visible={activeSheet === 'wallets'}
          requestKey={sheetSelection.requestKey}
          onClose={key => closeActionSheet('wallets', key)}
          onDismiss={onManagementDismissed}
          onCreate={() => handoffManagement(createNewWallet)}
          onImport={() =>
            handoffManagement(() => navigation.push('ImportWallet'))
          }
          onSettings={id =>
            handoffManagement(() => {
              setSettingsWalletId(id);
              setSettingsWalletStep('info');
              setActiveSheet('walletInfo');
            })
          }
        />
        <WalletSettingsSheet
          visible={activeSheet === 'walletInfo'}
          initialStep={settingsWalletStep}
          requestKey={sheetSelection.requestKey}
          walletId={settingsWalletId}
          onClose={key => closeActionSheet('walletInfo', key)}
          onRemoved={count => {
            if (!count) {
              resetToOnboarding();
            }
          }}
        />
        <AppSettingsSheet
          visible={activeSheet === 'settings'}
          requestKey={sheetSelection.requestKey}
          onClose={key => closeActionSheet('settings', key)}
          onReset={resetToOnboarding}
          onBackup={() => {
            if (!selectedWallet) {
              setActiveSheet('wallets');
              return;
            }
            setSettingsWalletId(selectedWallet.id);
            setSettingsWalletStep('backup');
            setActiveSheet('walletInfo');
          }}
        />
        <TransactionsSheet
          visible={activeSheet === 'activity'}
          requestKey={sheetSelection.requestKey}
          onClose={key => closeActionSheet('activity', key)}
        />
        <SendBitcoinSheet
          visible={activeSheet === 'send'}
          requestKey={sheetSelection.requestKey}
          onClose={key => closeActionSheet('send', key)}
        />
        <ReceiveBitcoinSheet
          visible={activeSheet === 'receive'}
          requestKey={sheetSelection.requestKey}
          onClose={key => closeActionSheet('receive', key)}
        />
      </SheetPresentationContext.Provider>
    </Animated.View>
  );
}
