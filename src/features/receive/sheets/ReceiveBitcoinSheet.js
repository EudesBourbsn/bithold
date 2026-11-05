import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  NativeModules,
  Platform,
  Pressable,
  Text,
  View,
  requireNativeComponent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useAddressBubble } from '../../../components/feedback/AddressBubble';
import { Icon } from '../../../components/icons/Icon';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { t as translate, useT } from '../../../i18n/index';
import { impactFeedback, selectionFeedback } from '../../../services/feedback';
import { typeName } from '../../../wallet/domain/keys';
import { NewAddressIcon } from '../components/NewAddressIcon';
import { ReceiveQr } from '../components/ReceiveQr';
import { sheetMetrics } from '../../../theme/sheetMetrics';
import { useReceiveSheetPresentation } from '../hooks/useReceiveSheetPresentation';
import { ReceiveAddressTypeStep } from '../steps/ReceiveAddressTypeStep';
import { styles } from '../styles/ReceiveBitcoinSheet.styles.js';

const QrMenu =
  Platform.OS === 'ios' ? requireNativeComponent('BitholdContextMenu') : View;
const QR_ACTIONS = [
  { id: 'copy', title: 'receive.qrCopy', systemIcon: 'doc.on.doc' },
  { id: 'share', title: 'receive.qrShare', systemIcon: 'square.and.arrow.up' },
];
function ReceiveContent({ visible, onChoosePath, rotation, onAddressShown }) {
  const t = useT();
  const qrActions = useMemo(
    () => QR_ACTIONS.map(action => ({ ...action, title: t(action.title) })),
    [t],
  );
  const { selectedWallet, engine } = useWallets();
  const [row, setRow] = useState(null);
  const walletId = selectedWallet?.id,
    standard = selectedWallet?.standard;
  const snapshot = selectedWallet?.snapshot;
  useEffect(() => {
    let current = true;
    if (visible && walletId) {
      engine
        .receive(walletId, standard)
        .then(value => {
          if (current) {
            setRow({
              ...value,
              walletId,
            });
          }
        })
        .catch(error => {
          if (current) {
            Alert.alert(translate('receive.addressFailed'), error.message);
          }
        });
    }
    return () => {
      current = false;
    };
  }, [visible, walletId, standard, snapshot, engine]);
  const address =
    row?.walletId === walletId && row?.type === standard ? row.address : '';

  const lastRotation = useRef(rotation);
  useEffect(() => {
    if (rotation === lastRotation.current) {
      return;
    }
    lastRotation.current = rotation;
    if (!visible || !walletId) {
      return;
    }
    let current = true;
    engine
      .receive(walletId, standard, 0, true)
      .then(value => {
        if (current) {
          setRow({ ...value, walletId });
        }
      })
      .catch(error => {
        if (current) {
          Alert.alert(translate('receive.newAddress'), error.message);
        }
      });
    return () => {
      current = false;
    };
  }, [rotation, visible, walletId, standard, engine]);
  useEffect(() => {
    onAddressShown(!!address);
  }, [address, onAddressShown]);
  const size = sheetMetrics.receive.qrSize + sheetMetrics.receive.qrPadding * 2;
  const showBubble = useAddressBubble();
  const copyAnchor = useRef(null),
    qr = useRef(null),
    busy = useRef(false);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);
  useEffect(() => {
    clearTimeout(copiedTimer.current);
    setCopied(false);
  }, [address]);
  useEffect(() => () => clearTimeout(copiedTimer.current), []);
  const copy = async () => {
    if (!address) {
      return;
    }
    await NativeModules.BitholdMedia.copyText(address);
    selectionFeedback();
    setCopied(true);
    copyAnchor.current?.measureInWindow((x, y, w, h) =>
      showBubble(
        t('common.copiedBubble'),
        {
          x,
          y,
          width: w,
          height: h,
        },
        true,
      ),
    );
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1600);
  };
  const exportQr = async action => {
    if (busy.current || !address) {
      return;
    }
    busy.current = true;
    try {
      const base64 = await new Promise((resolve, reject) => {
        if (!qr.current) {
          reject(new Error(t('error.tryAgain')));
          return;
        }
        qr.current.toDataURL(resolve);
      });
      if (action === 'copy') {
        await NativeModules.BitholdMedia.copyImage(base64);
      } else {
        await NativeModules.BitholdMedia.shareImage(base64);
      }
    } catch (error) {
      Alert.alert(
        action === 'copy' ? t('receive.copyFailed') : t('receive.shareFailed'),
        t('error.tryAgain'),
      );
    } finally {
      busy.current = false;
    }
  };
  return (
    <View>
      <View style={styles.topGap} />
      <Pressable
        style={styles.typePill}
        onPress={onChoosePath}
        accessibilityRole="button"
        accessibilityLabel={t('receive.typeLabel')}
        accessibilityHint={t('receive.typeHint')}
      >
        <Text style={styles.typePillText}>
          {typeName(standard) ?? typeName('nativeSegwit')}
        </Text>
        <Icon name="chevronDown" size={16} />
      </Pressable>
      <View style={styles.qrGap} />
      <View style={styles.qrCenter}>
        <QrMenu
          actions={qrActions}
          onPress={({ nativeEvent }) =>
            exportQr(qrActions[nativeEvent.index].id)
          }
        >
          <View
            accessibilityLabel={t('receive.qrLabel')}
            style={[
              styles.qr,
              {
                width: size,
                height: size,
              },
            ]}
          >
            {!!address && (
              <ReceiveQr address={address} size={sheetMetrics.receive.qrSize} />
            )}
          </View>
        </QrMenu>
      </View>
      <View style={styles.addressGap} />
      <View style={styles.addressCard}>
        <Text style={styles.addressLabel}>
          {t(
            standard === 'taproot'
              ? 'receive.addressLabelTaproot'
              : standard === 'legacy'
              ? 'receive.addressLabelLegacy'
              : 'receive.addressLabel',
          )}
        </Text>
        <View style={styles.addressRow}>
          <Pressable
            style={styles.address}
            onPress={onChoosePath}
            accessibilityRole="button"
            accessibilityLabel={
              address
                ? t('receive.choosePathAddress', { address })
                : t('receive.choosePath')
            }
            accessibilityHint={t('receive.choosePathHint')}
          >
            <Text style={styles.addressText}>{address || '—'}</Text>
          </Pressable>
          <Pressable
            ref={copyAnchor}
            accessibilityRole="button"
            accessibilityLabel={
              copied ? t('common.copied') : t('common.copyAddress')
            }
            onPress={copy}
            style={styles.copy}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                d={copied ? 'm5 12 4 4L19 6' : 'M9 7h12v14H9zM15 3H3v14'}
                fill="none"
                stroke="white"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>
      </View>
      <View pointerEvents="none" style={styles.export}>
        {!!address && (
          <ReceiveQr
            ref={qr}
            address={address}
            size={1024}
            displaySize={size}
            exportMode
          />
        )}
      </View>
    </View>
  );
}
export function ReceiveBitcoinSheet({ visible, requestKey = 0, onClose }) {
  const t = useT();
  const { selectedWallet } = useWallets();
  const [step, setStep] = useState('receive');
  const [rotation, setRotation] = useState(0);
  const [addressShown, setAddressShown] = useState(false);
  const presentation = useReceiveSheetPresentation();
  const selectingPath = useRef(false);
  const onSelectingPath = useCallback(value => {
    selectingPath.current = value;
  }, []);
  const backToReceive = useCallback(() => {
    if (!selectingPath.current) {
      setStep('receive');
    }
  }, []);
  useEffect(() => {
    setStep('receive');
  }, [visible, requestKey, selectedWallet?.id]);
  const choosePath = () => {
    selectionFeedback();
    setStep('path');
  };
  return (
    <AdaptiveSheet
      visible={visible}
      requestKey={requestKey}
      onClose={onClose}
      step={step}
      presentation={presentation}
      header={
        <SheetHeader
          title={step === 'path' && selectedWallet ? '' : t('receive.title')}
          onBack={step === 'path' && selectedWallet ? backToReceive : undefined}
          right={
            step === 'receive' &&
            selectedWallet &&
            !selectedWallet.fixed && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('receive.newAddress')}
                accessibilityHint={t('receive.newAddressHint')}
                accessibilityState={{ disabled: !addressShown }}
                disabled={!addressShown}
                hitSlop={10}
                onPress={() => {
                  impactFeedback();
                  setRotation(count => count + 1);
                }}
                style={({ pressed }) => [
                  styles.newAddress,
                  (pressed || !addressShown) && styles.newAddressDimmed,
                ]}
              >
                <NewAddressIcon />
              </Pressable>
            )
          }
        />
      }
    >
      {step === 'path' && selectedWallet ? (
        <ReceiveAddressTypeStep
          key={selectedWallet.id}
          onBack={() => setStep('receive')}
          onSelectingChange={onSelectingPath}
        />
      ) : (
        <ReceiveContent
          visible={visible}
          onChoosePath={choosePath}
          rotation={rotation}
          onAddressShown={setAddressShown}
        />
      )}
    </AdaptiveSheet>
  );
}
