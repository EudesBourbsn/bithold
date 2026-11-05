import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useWallets } from '../../../app/providers/WalletProvider';
import { useT } from '../../../i18n/index';
import { selectionFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { styles } from '../styles/ReceiveAddressTypeStep.styles';
import { typeName } from '../../../wallet/domain/keys';

function pathLabel(t, account) {
  if (account.path === 'WIF') {
    return t('receive.path.wif');
  }
  if (account.path === 'address') {
    return t('receive.path.address');
  }
  if (account.path === 'descriptor') {
    return t('receive.path.descriptor');
  }

  return `${account.path}/0/*`;
}

export function ReceiveAddressTypeStep({ onBack, onSelectingChange }) {
  const t = useT();
  const { selectedWallet, engine } = useWallets();
  const [pending, setPending] = useState(null);
  const selecting = useRef(false),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    onSelectingChange(false);
    return () => {
      mounted.current = false;
      onSelectingChange(false);
    };
  }, [onSelectingChange]);
  const choose = async type => {
    if (selecting.current || !selectedWallet) {
      return;
    }
    if (type === selectedWallet.standard) {
      onBack();
      return;
    }
    selecting.current = true;
    onSelectingChange(true);
    setPending(type);
    selectionFeedback();
    const walletId = selectedWallet.id;
    try {
      await engine.receive(walletId, type);
      await engine.update(walletId, { standard: type });
      if (mounted.current && engine.state.selectedId === walletId) {
        onBack();
      }
    } catch (error) {
      if (mounted.current) {
        Alert.alert(t('receive.pathFailed'), error.message);
      }
    } finally {
      selecting.current = false;
      if (mounted.current) {
        onSelectingChange(false);
        setPending(null);
      }
    }
  };
  const accounts = selectedWallet?.accounts ?? [];
  return (
    <View style={styles.list}>
      {accounts.map((account, index) => {
        const selected = account.type === selectedWallet.standard;
        const title = typeName(account.type) ?? typeName('descriptor');
        const path = pathLabel(t, account);
        return (
          <View key={account.type}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                selected,
                checked: selected,
                disabled: pending !== null,
                busy: pending === account.type,
              }}
              accessibilityLabel={`${title}, ${path}`}
              disabled={pending !== null}
              onPress={() => choose(account.type)}
              style={styles.row}
            >
              <View style={styles.labels}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.path}>{path}</Text>
              </View>
              <View style={styles.indicator}>
                {pending === account.type ? (
                  <ActivityIndicator size="small" color={colors.button} />
                ) : (
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Circle
                      cx={12}
                      cy={12}
                      r={10.5}
                      fill={selected ? colors.button : 'none'}
                      stroke={selected ? colors.button : colors.sheetHandle}
                      strokeWidth={1.5}
                    />
                    {selected && (
                      <Path
                        d="m7.5 12 3 3 6-6"
                        fill="none"
                        stroke={colors.onButton}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </Svg>
                )}
              </View>
            </Pressable>
            {index < accounts.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );
}
