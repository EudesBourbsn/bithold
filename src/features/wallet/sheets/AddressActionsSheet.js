import { useEffect, useRef } from 'react';
import { Alert, Share, StyleSheet, Text, View } from 'react-native';
import { NativeSymbol } from '../../../components/icons/Icon';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { colors, sheetMetrics, typography } from '../../../theme/index';
import { SettingsRow } from '../../settings/components/SettingsRow';
import { copyAddress } from '../components/AddressRow';

const actions = [
  { id: 'copy', title: 'addresses.menuCopy', symbol: 'document.on.clipboard' },
  { id: 'share', title: 'receive.qrShare', symbol: 'square.and.arrow.up' },
  { id: 'wif', title: 'addresses.menuCopyWif', symbol: 'key' },
  { id: 'signVerify', title: 'walletSettings.signVerify', symbol: 'signature' },
];

export function AddressActionsSheet({
  enabled,
  visible,
  requestKey,
  item,
  onClose,
  onCopyPrivateKey,
  onSignVerify,
}) {
  const t = useT();
  const pending = useRef(null);
  const latest = useRef(null);
  latest.current = {
    enabled,
    requestKey,
    item,
    onCopyPrivateKey,
    onSignVerify,
  };
  useEffect(() => {
    pending.current = null;
  }, [enabled, requestKey]);

  const choose = id => {
    if (!enabled || !visible || !item || pending.current) return;
    pending.current = { id, item, requestKey };
    impactFeedback();
    onClose(requestKey);
  };
  const finish = () => {
    const action = pending.current;
    pending.current = null;
    const owner = latest.current;
    if (
      !action ||
      !owner.enabled ||
      action.requestKey !== owner.requestKey ||
      action.item.address !== owner.item?.address
    ) {
      return;
    }
    if (action.id === 'copy') {
      copyAddress(action.item.address);
    } else if (action.id === 'share') {
      Share.share({ message: action.item.address }).catch(() =>
        Alert.alert(t('receive.shareFailed')),
      );
    } else if (action.id === 'wif') {
      owner.onCopyPrivateKey?.(action.item);
    } else if (action.id === 'signVerify') {
      owner.onSignVerify?.(action.item);
    }
  };

  return (
    <AdaptiveSheet
      visible={enabled && visible}
      requestKey={requestKey}
      onClose={onClose}
      onDismiss={finish}
      header={<SheetHeader title={t('messageSigning.address')} />}
    >
      <View style={styles.content}>
        <Text style={styles.address}>{item?.address}</Text>
        {actions
          .filter(action =>
            action.id === 'wif'
              ? !!onCopyPrivateKey
              : action.id === 'signVerify'
              ? !!onSignVerify
              : true,
          )
          .map(action => (
            <SettingsRow
              key={action.id}
              title={t(action.title)}
              onPress={() => choose(action.id)}
              trailing={<View />}
              glyph={
                <NativeSymbol
                  symbolName={action.symbol}
                  pointSize={sheetMetrics.row.iconSize}
                  weight="regular"
                  tintColor={colors.foreground}
                  style={styles.icon}
                />
              }
            />
          ))}
      </View>
    </AdaptiveSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: sheetMetrics.content.top,
    paddingBottom: sheetMetrics.content.bottom,
  },
  address: {
    ...typography.address,
    color: colors.secondary,
    writingDirection: 'ltr',
    textAlign: 'center',
    marginHorizontal: sheetMetrics.content.horizontalInset,
    marginBottom: sheetMetrics.content.top,
  },
  icon: {
    width: sheetMetrics.row.iconSize,
    height: sheetMetrics.row.iconSize,
  },
});
