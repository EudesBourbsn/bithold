import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  NativeEventEmitter,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useSheetScrollGesture } from '../../../components/sheets/SheetGestureContext';
import { useT } from '../../../i18n/index';
import { buttonMetrics } from '../../../theme/buttonMetrics';
import { sheetMetrics } from '../../../theme/sheetMetrics';
import { useLock } from '../../security/providers/LockProvider';
import { RecoveryGlass } from '../components/RecoveryGlass';
import { RecoveryWords, recoveryRowPadding } from '../components/RecoveryWords';
import { styles } from '../styles/WalletBackupStep.styles.js';

const checklist = [
  'backup.check.writeDown',
  'backup.check.private',
  'backup.check.protect',
  'backup.check.neverShare',
  'backup.check.dontLose',
];

export function WalletBackupStep({ walletId, onDone }) {
  const t = useT();
  const { engine } = useWallets();
  const { requireUnlock } = useLock();
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const nativeScroll = useSheetScrollGesture();
  const [revealed, setRevealed] = useState(false);
  const [material, setMaterial] = useState(null);
  const [cardHeight, setCardHeight] = useState(455);
  const [headingHeight, setHeadingHeight] = useState(100);
  const [passphraseHeight, setPassphraseHeight] = useState(0);
  const coverOpacity = useSharedValue(1);
  const conceal = useCallback(() => {
    setRevealed(false);
    coverOpacity.value = 1;
  }, [coverOpacity]);
  const done = useCallback(() => {
    conceal();
    setMaterial(null);
    onDone();
  }, [conceal, onDone]);
  // Done on the Secret Key marks the wallet backed up; going back does not.
  const finish = useCallback(() => {
    engine.markBackedUp(walletId).catch(() => {});
    done();
  }, [engine, walletId, done]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        conceal();
      }
    });
    return () => subscription.remove();
  }, [conceal]);
  useEffect(() => {
    if (!material) {
      return;
    }
    const privacy = NativeModules.BitholdWallet;
    privacy?.setRecoveryPrivacy?.(true);
    const capture = privacy
      ? new NativeEventEmitter(privacy).addListener(
          'walletRecoveryPrivacy',
          conceal,
        )
      : null;
    return () => {
      capture?.remove();
      privacy?.setRecoveryPrivacy?.(false);
    };
  }, [material, conceal]);
  useEffect(() => {
    let active = true;
    const loadMaterial = async () => {
      try {
        await requireUnlock({ reason: 'backup' });
        if (!active) {
          return;
        }
        const value = await engine.recoveryMaterial(walletId);
        if (active) {
          setMaterial(value);
        }
      } catch (error) {
        if (!active) {
          return;
        }
        if (error?.code !== 'cancelled') {
          Alert.alert(t('backup.secretKey'), error?.message ?? String(error));
        }
        done();
      }
    };
    loadMaterial();
    return () => {
      active = false;
    };
  }, [requireUnlock, engine, walletId, done, t]);
  const reveal = () => {
    setRevealed(true);
    coverOpacity.value = withTiming(0, { duration: 200 });
  };
  const release = () => {
    setRevealed(false);
    coverOpacity.value = withTiming(1, {
      duration: 200,
    });
  };
  const hold = usePanGesture({
    block: nativeScroll,
    runOnJS: true,
    minDistance: 0,
    activateAfterLongPress: 0,
    shouldCancelWhenOutside: false,
    onBegin: reveal,
    onFinalize: release,
  });
  const coverStyle = useAnimatedStyle(() => ({
    opacity: coverOpacity.value,
  }));
  if (!material) {
    return null;
  }
  const words =
    material.kind === 'mnemonic' ? material.input.trim().split(/\s+/) : [];
  const cardWidth = width - 60;
  const small = height < 700;
  const reservedHeight =
    sheetMetrics.header.height +
    headingHeight +
    buttonMetrics.primary.height * 2 +
    styles.done.marginTop +
    insets.bottom +
    styles.material.paddingVertical * 2 +
    styles.hold.marginBottom +
    (material.passphrase ? passphraseHeight + styles.passphrase.marginTop : 0);
  const rowPadding = recoveryRowPadding({
    availableHeight: height - insets.top - reservedHeight,
    wordCount: words.length,
    fontScale,
    preferredPadding: small ? 5 : 10,
  });
  return (
    <View style={styles.page}>
      <View
        style={styles.heading}
        onLayout={({ nativeEvent }) =>
          setHeadingHeight(nativeEvent.layout.height)
        }
      >
        <Text style={[styles.title, small && styles.smallTitle]}>
          {t('backup.revealTitle')}
        </Text>
        <Text style={[styles.description, small && styles.smallDescription]}>
          {words.length ? t('backup.revealWords') : t('backup.revealKey')}
        </Text>
      </View>
      <View
        style={[
          styles.card,
          {
            width: cardWidth,
          },
        ]}
        onLayout={({ nativeEvent }) => {
          setCardHeight(nativeEvent.layout.height);
        }}
      >
        <RecoveryGlass
          width={cardWidth}
          height={cardHeight}
          radius={35}
          tint="#303143"
        />
        <View
          pointerEvents="none"
          accessibilityElementsHidden={!revealed}
          importantForAccessibility={revealed ? 'auto' : 'no-hide-descendants'}
          style={[styles.material, !revealed && styles.hiddenMaterial]}
        >
          {words.length ? (
            <RecoveryWords words={words} rowPadding={rowPadding} />
          ) : (
            <Text selectable={false} style={styles.privateKey}>
              {material.input}
            </Text>
          )}
          {!!material.passphrase && (
            <View
              style={styles.passphrase}
              onLayout={({ nativeEvent }) =>
                setPassphraseHeight(nativeEvent.layout.height)
              }
            >
              <Text style={styles.passphraseLabel}>
                {t('import.bip39Passphrase')}
              </Text>
              <Text selectable={false} style={styles.passphraseValue}>
                {material.passphrase}
              </Text>
            </View>
          )}
        </View>
        <Animated.View
          pointerEvents="none"
          accessibilityElementsHidden={revealed}
          importantForAccessibility={revealed ? 'no-hide-descendants' : 'auto'}
          style={[StyleSheet.absoluteFill, coverStyle]}
        >
          <View style={styles.cover}>
            <Text style={styles.coverTitle}>{t('backup.coverTitle')}</Text>
            <View style={styles.checklist}>
              {checklist.map(item => (
                <View style={styles.checklistRow} key={item}>
                  <View style={styles.checkCircle}>
                    <RecoveryGlass
                      width={35}
                      height={35}
                      radius={17.5}
                      top={0.9}
                      bottom={0.7}
                    />
                    <Text style={styles.check}>✓</Text>
                  </View>
                  <Text style={styles.checklistText}>{t(item)}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
        <GestureDetector gesture={hold}>
          <View
            collapsable={false}
            accessible
            accessibilityRole="button"
            accessibilityLabel={t('backup.hold')}
            accessibilityHint={t('backup.holdHint')}
            style={[
              styles.hold,
              {
                width: cardWidth - 100,
              },
            ]}
          >
            <RecoveryGlass
              width={cardWidth - 100}
              height={48}
              radius={25}
              top={0.9}
              bottom={0.7}
            />
            <Text style={styles.holdText}>{t('backup.hold')}</Text>
          </View>
        </GestureDetector>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.done')}
        onPress={finish}
        style={({ pressed }) => [
          styles.done,
          {
            width: cardWidth,
          },
          pressed && {
            opacity: 0.8,
          },
        ]}
      >
        <Text style={styles.doneText}>{t('common.done')}</Text>
      </Pressable>
    </View>
  );
}
