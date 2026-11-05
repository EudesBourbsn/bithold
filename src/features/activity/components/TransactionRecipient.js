import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  NativeModules,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useAddressBubble } from '../../../components/feedback/AddressBubble';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { buttonMetrics } from '../../../theme/buttonMetrics';
import { addressURL, truncateAddress } from '../domain/transactions';
import { styles } from '../styles/TransactionDetailsStep.styles.js';
import { TransactionGlass } from './TransactionGlass';
import { TransactionWalletIcon } from './TransactionWalletIcon';

function ValueTouchable({ copyValue, url, children }) {
  const t = useT();
  if (!copyValue && !url) {
    return children;
  }
  const copy = () =>
    Promise.resolve()
      .then(() => NativeModules.BitholdMedia.copyText(copyValue))
      .then(impactFeedback)
      .catch(error => Alert.alert(t('transaction.title'), error.message));
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole={url ? 'link' : 'button'}
      accessibilityLabel={copyValue}
      accessibilityHint={
        url ? t('transaction.explorerHint') : t('transaction.holdToCopy')
      }
      onPress={
        url
          ? () =>
              Linking.openURL(url).catch(error =>
                Alert.alert(t('transaction.title'), error.message),
              )
          : undefined
      }
      onLongPress={copyValue ? copy : undefined}
      style={styles.valueRow}
    >
      {children}
    </TouchableOpacity>
  );
}
export function DetailRow({
  label,
  value,
  copyValue,
  url,
  children,
  last = false,
}) {
  const content = children ?? (
    <Text style={[styles.value, url && styles.link]} numberOfLines={3}>
      {value}
    </Text>
  );
  return (
    <View style={[styles.detailRow, last && styles.lastRow]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <ValueTouchable copyValue={copyValue} url={url}>
          {content}
        </ValueTouchable>
      </View>
    </View>
  );
}
export function Addresses({ label, addresses, network, last = false }) {
  const { electrum, preferences } = useWallets();
  const variant = electrum?.variants?.[network];
  return addresses.map((address, index) => (
    <DetailRow
      key={address}
      label={index === 0 ? label : ''}
      value={truncateAddress(address)}
      copyValue={address}
      url={addressURL(address, network, variant, preferences.blockExplorer)}
      last={last && index === addresses.length - 1}
    />
  ));
}
export function PersonalNoteRow({ message, onPress }) {
  const t = useT();
  const [width, setWidth] = useState(0);
  return (
    <DetailRow label={t('note.title')} last>
      {message ? (
        <Text
          suppressHighlighting
          numberOfLines={1}
          accessibilityRole="button"
          accessibilityHint={t('note.editHint')}
          onPress={onPress}
          style={[styles.value, styles.noteValue]}
        >
          {message}
        </Text>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={onPress}
          onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
          style={styles.notePill}
        >
          {width > 0 && (
            <TransactionGlass
              width={width}
              height={buttonMetrics.link.minHeight}
              radius={18}
            />
          )}
          <Text style={styles.notePillText}>{t('note.add')}</Text>
        </TouchableOpacity>
      )}
    </DetailRow>
  );
}

export function FeePill({ fiatLabel, bitcoinLabel }) {
  const t = useT();

  const [showBitcoin, setShowBitcoin] = useState(false);
  const label = showBitcoin || !fiatLabel ? bitcoinLabel : fiatLabel;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={t('transaction.feeLabel', { amount: label })}
      accessibilityHint={
        fiatLabel ? t('transaction.feeHint') : t('transaction.holdToCopy')
      }
      onPress={() => fiatLabel && setShowBitcoin(value => !value)}
      onLongPress={() =>
        Promise.resolve()
          .then(() => NativeModules.BitholdMedia.copyText(bitcoinLabel))
          .then(impactFeedback)
          .catch(error => Alert.alert(t('transaction.title'), error.message))
      }
      style={styles.feePill}
    >
      <Text style={styles.feePillText}>{label}</Text>
    </TouchableOpacity>
  );
}
export function Recipient({ addresses, wallet, width, onWidth }) {
  const t = useT();
  const anchor = useRef(null),
    alive = useRef(true),
    generation = useRef(0);
  const dismiss = useRef(() => {});
  const showBubble = useAddressBubble();
  const value = addresses.join('\n');
  const currentAddress = useRef(value);
  useEffect(() => {
    const requests = generation;
    currentAddress.current = value;
    alive.current = true;
    return () => {
      alive.current = false;
      requests.current++;
      dismiss.current();
    };
  }, [value]);
  const show = (text, duration, owner = generation.current) => {
    anchor.current?.measureInWindow((x, y, w, h) => {
      if (
        !alive.current ||
        currentAddress.current !== value ||
        owner !== generation.current
      ) {
        return;
      }
      dismiss.current =
        showBubble(
          text,
          {
            x,
            y,
            width: w,
            height: h,
          },
          false,
          {
            transaction: true,
            duration,
            onLongPress: copy,
            onDismiss: () => {
              if (owner === generation.current) {
                generation.current++;
              }
            },
          },
        ) ?? (() => {});
    });
  };
  const copy = async () => {
    if (!alive.current || currentAddress.current !== value) {
      return;
    }
    const owner = ++generation.current;
    dismiss.current();
    try {
      await NativeModules.BitholdMedia.copyText(value);
      if (!alive.current || owner !== generation.current) {
        return;
      }
      impactFeedback();
      show(t('transaction.copied'), 1500, owner);
    } catch (error) {
      if (alive.current && owner === generation.current) {
        Alert.alert(t('common.copyAddress'), error.message);
      }
    }
  };
  const pill = (
    <View
      ref={anchor}
      collapsable={false}
      style={styles.recipient}
      onLayout={({ nativeEvent }) => onWidth(nativeEvent.layout.width)}
    >
      {width > 0 && (
        <TransactionGlass
          width={width}
          height={40}
          radius={20}
          arcColor="white"
        />
      )}
      <TransactionWalletIcon wallet={wallet} />
      <Text style={styles.value} numberOfLines={1}>
        {addresses.length === 1
          ? truncateAddress(addresses[0], 8, 9)
          : t('transaction.addressCount', { count: addresses.length })}
      </Text>
    </View>
  );
  return (
    <TouchableOpacity
      activeOpacity={0.2}
      accessibilityRole="button"
      accessibilityLabel={value}
      accessibilityHint={t('transaction.recipientHint')}
      onPress={() => {
        if (!alive.current || currentAddress.current !== value) {
          return;
        }
        generation.current++;
        show(value, null);
      }}
      onLongPress={copy}
    >
      {pill}
    </TouchableOpacity>
  );
}
