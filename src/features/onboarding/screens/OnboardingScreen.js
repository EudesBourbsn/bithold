import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useReducedMotion, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWalletLoader } from '../../../app/providers/WalletLoaderProvider';
import {
  finishWalletEntry,
  useWallets,
} from '../../../app/providers/WalletProvider';
import { WelcomeOptions } from '../components/WelcomeOptions';
import { WelcomeTerms } from '../components/WelcomeTerms';
import { WelcomeEntrance } from '../components/WelcomeEntrance';
import { WelcomeIdentity } from '../components/WelcomeIdentity';
import { AppBackground } from '../../../components/backgrounds/AppBackground';
import { SheetPresentationContext } from '../../../components/sheets/SheetPresentation';
import { useT } from '../../../i18n/index';
import { selectionFeedback } from '../../../services/feedback';
import { useCloudRestore } from '../../backup/hooks/useCloudRestore';
import { CloudRestoreSheet } from '../../backup/sheets/CloudRestoreSheet';
import { WelcomeBackground } from '../components/WelcomeBackground';
import { typography } from '../../../theme/index';
import { headlineSize, welcomeLayout } from '../theme/welcomeLayout';
import { ImportWalletSheet } from '../sheets/ImportWalletSheet';

function acknowledgePress() {
  selectionFeedback();
}

export function OnboardingScreen({ navigation }) {
  const t = useT();
  const { createWallet, ready, walletCount } = useWallets();
  const [busy, setBusy] = useState(false);
  const loader = useWalletLoader();
  const [importSheet, setImportSheet] = useState({ open: false, key: 0 });
  const afterImportSheet = useRef(null);
  const [handingOff, setHandingOff] = useState(false);
  const cloud = useCloudRestore({
    visible: importSheet.open,
    onRestored: () => {
      setHandingOff(true);
      afterImportSheet.current = () => finishWalletEntry(navigation);
      closeImportSheet(importSheet.key);
    },
  });
  const restoring = cloud.engaged || handingOff;
  const closeImportSheet = key =>
    setImportSheet(previous =>
      previous.open && previous.key === key
        ? { ...previous, open: false }
        : previous,
    );
  useEffect(() => {
    // Not under the restore sheets: "Restore successful!" leads on.
    if (ready && !restoring && walletCount > 0) {
      finishWalletEntry(navigation);
    }
  }, [ready, restoring, walletCount, navigation]);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const compact = height < welcomeLayout.compactHeight;
  const reducedMotion = useReducedMotion();
  const handoff = useSharedValue(reducedMotion ? 1 : 0);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      {/* The same page background as Balance, import and the lock. */}
      <AppBackground />
      <WelcomeBackground />
      {/* Not flattened: the actions' zIndex must stay inside, or Fabric
          stacks the cards and terms above the Import sheet. */}
      <View collapsable={false} style={styles.content}>
        <View style={[styles.hero, { paddingTop: insets.top }]}>
          <WelcomeIdentity
            width={width}
            height={height}
            compact={compact}
            progress={handoff}
          />
          <WelcomeEntrance handoff={handoff} index={0}>
            {/* The sizes are set by screen height, so the system text size
                does not scale them; on a narrow (Display Zoom) screen the
                three lines shrink to fit rather than wrap to a fourth. */}
            <Text
              allowFontScaling={false}
              adjustsFontSizeToFit
              numberOfLines={3}
              style={[
                typography.onboardingTitle,
                styles.headline,
                { fontSize: headlineSize(height) },
              ]}
            >
              {t('onboarding.welcome.selfCustody')}
            </Text>
          </WelcomeEntrance>
        </View>
        <View
          style={[
            styles.actions,
            compact ? styles.compactActions : styles.regularActions,
          ]}
        >
          <WelcomeOptions
            handoff={handoff}
            creating={busy || !ready || restoring}
            importing={busy || restoring}
            onCreate={async () => {
              if (busy || !ready) {
                return;
              }
              acknowledgePress();
              setBusy(true);
              loader.enter(t('onboarding.creating'));
              try {
                await createWallet();
                finishWalletEntry(navigation);
              } catch (error) {
                loader.exit();
                Alert.alert(t('onboarding.createFailed'), error.message);
              } finally {
                setBusy(false);
              }
            }}
            onImport={() => {
              acknowledgePress();
              setImportSheet(previous => ({
                open: true,
                key: previous.key + 1,
              }));
            }}
          />
          <WelcomeEntrance handoff={handoff} index={1} style={styles.terms}>
            <WelcomeTerms />
          </WelcomeEntrance>
        </View>
        <View style={{ height: insets.bottom }} />
      </View>
      {/* Inline, as on Balance: the restore sheets stack above Import with
          (two native sheets side by side cannot). */}
      <SheetPresentationContext.Provider value="inline">
        <ImportWalletSheet
          visible={importSheet.open}
          requestKey={importSheet.key}
          onClose={closeImportSheet}
          onDismiss={() => {
            const next = afterImportSheet.current;
            afterImportSheet.current = null;
            next?.();
          }}
          onSelect={method => {
            if (method === 'phrase') {
              afterImportSheet.current = () =>
                navigation.navigate('ImportWallet');
              closeImportSheet(importSheet.key);
            } else {
              cloud.start();
            }
          }}
          disabledId={cloud.checking ? 'cloud' : undefined}
        />
        <CloudRestoreSheet visible={importSheet.open} {...cloud.sheetProps} />
      </SheetPresentationContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1 },
  hero: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: welcomeLayout.heroMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    paddingHorizontal: welcomeLayout.sideInset,
    zIndex: 1,
  },
  terms: {
    marginTop: welcomeLayout.termsTop,
    marginBottom: welcomeLayout.termsBottomSpace,
  },
  compactActions: { paddingBottom: welcomeLayout.compactBottomInset },
  regularActions: { paddingBottom: welcomeLayout.bottomInset },
  // The app's onboarding title (typography.onboardingTitle), its lines
  // broken in the catalog; the size follows the screen height.
  headline: {
    marginTop: welcomeLayout.subtitleTop,
    marginHorizontal: welcomeLayout.sideInset,
  },
});
