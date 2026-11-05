import { useEffect, useRef, useState } from 'react';
import {
  AppState,
  Linking,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
  requireNativeComponent,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors, typography } from '../../../theme/index';
import { addressFromQr } from '../domain/address';
import { fonts } from '../../../theme/fonts';

const Camera =
  Platform.OS === 'ios' ? requireNativeComponent('BitholdCamera') : View;
export function QrScannerModal({
  visible,
  onClose,
  onScanned,
  raw = false,
}) {
  const t = useT();
  const { selectedWallet } = useWallets();
  const network = selectedWallet?.network ?? 'Mainnet';
  const { width, height } = useWindowDimensions(),
    insets = useSafeAreaInsets();
  const [surfaceWidth, setSurfaceWidth] = useState(null);
  const cameraWidth = surfaceWidth ?? width;
  const [status, setStatus] = useState('starting'),
    [invalid, setInvalid] = useState(false),
    [active, setActive] = useState(true);
  const completed = useRef(false);
  const modalHeight =
      height - insets.top - 5,
    size = Math.min(cameraWidth * 0.7, 305);
  useEffect(() => {
    if (!visible) {
      return;
    }
    let mounted = true;
    completed.current = false;
    setInvalid(false);
    setStatus('starting');
    NativeModules.BitholdMedia.requestCamera()
      .then(value => {
        if (mounted) {
          setStatus(value);
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus('unavailable');
        }
      });
    const subscription = AppState.addEventListener('change', value =>
      setActive(value === 'active'),
    );
    return () => {
      mounted = false;
      completed.current = true;
      subscription.remove();
    };
  }, [visible]);
  const detected = event => {
    if (!visible || !active || completed.current) {
      return;
    }
    const address = raw
      ? event.nativeEvent.value?.trim()
      : addressFromQr(event.nativeEvent.value, network);
    if (address) {
      completed.current = true;
      impactFeedback();
      onScanned(address);
    } else {
      setInvalid(true);
    }
  };
  const denied = status === 'denied';
  return (
    <AdaptiveSheet
      visible={visible}
      onClose={onClose}
      tall
      bottomPadding={false}
    >
      <View
        collapsable={false}
        onLayout={event => setSurfaceWidth(event.nativeEvent.layout.width)}
        style={[{ height: modalHeight }, { backgroundColor: colors.modal }]}
      >
        {status === 'authorized' && (
          <Camera
            style={StyleSheet.absoluteFill}
            active={visible && active && !completed.current}
            onCode={detected}
            onStatus={e => setStatus(e.nativeEvent.status)}
          />
        )}
        {(denied || status === 'unavailable') && (
          <View style={styles.unavailable}>
            <Text style={styles.message}>
              {denied ? t('scanner.denied') : t('scanner.unavailable')}
            </Text>
            {denied && (
              <SheetButton
                label={t('scanner.openSettings')}
                onPress={() => Linking.openSettings()}
                style={styles.settings}
              />
            )}
          </View>
        )}
        <View
          pointerEvents="none"
          style={[
            styles.corners,
            {
              width: size,
              height: size,
              left: (cameraWidth - 10 - size) / 2,
              bottom: insets.bottom + 50,
            },
          ]}
        >
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Path
              d={`M0 23V20A20 20 0 0 1 20 0H23M${size - 23} 0H${
                size - 20
              }A20 20 0 0 1 ${size} 20V23M${size} ${size - 23}V${
                size - 20
              }A20 20 0 0 1 ${size - 20} ${size}H${
                size - 23
              }M23 ${size}H20A20 20 0 0 1 0 ${size - 20}V${size - 23}`}
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>
        <View
          pointerEvents="none"
          style={[styles.footer, { bottom: insets.bottom + 20 }]}
        >
          <Text style={styles.title}>{t('scanner.title')}</Text>
          {invalid && <Text style={styles.error}>{t('scanner.invalid')}</Text>}
        </View>
      </View>
    </AdaptiveSheet>
  );
}
const styles = StyleSheet.create({
  unavailable: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...fonts.regular,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  settings: { marginTop: 24 },
  corners: { position: 'absolute' },
  footer: { position: 'absolute', left: 20, right: 20, alignItems: 'center' },
  title: {
    ...fonts.semibold,
    fontSize: 25,
    letterSpacing: -0.25,
    lineHeight: 30,
    color: 'white',
  },
  error: {
    ...typography.label,
    color: colors.error,
    textAlign: 'center',
    marginTop: 8,
  },
});
