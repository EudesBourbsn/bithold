import { MenuView } from '@react-native-menu/menu';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeSymbol } from '../../../components/icons/Icon';
import { SheetNavigationButton } from '../../../components/sheets/SheetNavigationButton';
import { useT } from '../../../i18n/index';
import { colors } from '../../../theme/colors';
import { navigationMetrics } from '../../../theme/navigationMetrics';
import { TransactionGlass } from '../../activity/components/TransactionGlass';

function ImportHeaderMenu({ enabled, disabled, onToggle }) {
  const t = useT();
  return (
    <View pointerEvents={disabled ? 'none' : 'auto'}>
      <MenuView
        title=""
        isAnchoredToRight
        themeVariant="dark"
        shouldOpenOnLongPress={false}
        onPressAction={onToggle}
        actions={[
          {
            id: 'passphrase',
            title: t('import.passphrase'),
            image: 'rectangle.and.pencil.and.ellipsis',
            imageColor: '#FFFFFF',
            state: enabled ? 'on' : 'off',
            attributes: { disabled },
          },
        ]}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('import.options')}
          disabled={disabled}
          activeOpacity={0.2}
          style={styles.menu}
        >
          <View style={styles.glass}>
            <TransactionGlass
              width={40}
              height={40}
              radius={20}
              glowTop={0.4}
              glowBottom={0.3}
            />
            <NativeSymbol
              symbolName="ellipsis"
              pointSize={17}
              weight="semibold"
              tintColor={colors.foreground}
              style={styles.symbol}
            />
          </View>
        </TouchableOpacity>
      </MenuView>
    </View>
  );
}

export function useImportHeader({ navigation, busy, title = '' }) {
  const t = useT();
  const [enabled, setEnabled] = useState(false);
  const pendingPrompt = useRef(null);
  const toggle = useCallback(() => {
    Keyboard.dismiss();
    setEnabled(value => !value);
  }, []);
  useLayoutEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    navigation.setOptions({
      title,
      headerTitleStyle: {
        fontFamily: 'System',
        fontSize: 17,
        fontWeight: '600',
      },
      headerBackVisible: false,
      headerLeftBackgroundVisible: false,
      headerRightBackgroundVisible: false,
      headerLeft: () => (
        <SheetNavigationButton
          disabled={busy}
          onPress={() => navigation.goBack()}
        />
      ),
      headerBackButtonDisplayMode: 'minimal',
      gestureEnabled: !busy,
      headerRight: () => (
        <ImportHeaderMenu enabled={enabled} disabled={busy} onToggle={toggle} />
      ),
    });
  }, [navigation, enabled, busy, toggle, t, title]);

  const requestPassphrase = () => {
    if (!enabled) {
      return Promise.resolve('');
    }
    if (!pendingPrompt.current) {
      Keyboard.dismiss();
      pendingPrompt.current = new Promise(resolve => {
        Alert.prompt(
          t('import.passphrase'),
          t('import.passphrasePrompt'),
          [
            {
              text: t('common.cancel'),
              style: 'cancel',
              onPress: () => resolve(null),
            },
            { text: t('common.ok'), onPress: value => resolve(value ?? '') },
          ],
          'secure-text',
        );
      }).finally(() => {
        pendingPrompt.current = null;
      });
    }
    return pendingPrompt.current;
  };
  return { requestPassphrase };
}

const styles = StyleSheet.create({
  symbol: { width: 24, height: 24 },
  menu: {
    width: navigationMetrics.controlSize,
    height: navigationMetrics.controlSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
