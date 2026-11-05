import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useWallets } from '../../../app/providers/WalletProvider';
import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { impactFeedback } from '../../../services/feedback';
import { buttonMetrics, colors, typography } from '../../../theme/index';
import { useCloudRestore } from '../../backup/hooks/useCloudRestore';
import { CloudRestoreSheet } from '../../backup/sheets/CloudRestoreSheet';
import {
  CloudBackupIcon,
  CreateWalletIcon,
  SeedPhraseIcon,
} from '../../onboarding/components/ImportMethodIcons';
import { WalletMethodList } from '../../onboarding/components/WalletMethodList';
import { WalletListRow } from '../components/WalletListRow';

const ADD_ROWS = [
  {
    id: 'create',
    title: 'addWallet.createTitle',
    description: 'addWallet.createDescription',
    Icon: CreateWalletIcon,
  },
  {
    id: 'phrase',
    title: 'onboarding.import',
    description: 'importWith.phraseDescription',
    Icon: SeedPhraseIcon,
  },
  {
    id: 'cloud',
    title: 'addWallet.icloudTitle',
    description: 'importWith.cloudDescription',
    Icon: CloudBackupIcon,
  },
];

export function ManageWalletsSheet({
  visible,
  requestKey = 0,
  onClose,
  onCreate,
  onImport,
  onSettings,
  onDismiss,
}) {
  const t = useT();
  const cloud = useCloudRestore({
    visible,
    onRestored: () => onClose(requestKey),
  });
  const { wallets, selectedId, selectWallet } = useWallets();
  const [step, setStep] = useState('wallets');
  useEffect(() => {
    if (visible) {
      setStep('wallets');
    }
  }, [visible, requestKey]);
  const adding = step === 'add';
  return (
    <>
      <AdaptiveSheet
        visible={visible}
        requestKey={requestKey}
        onClose={onClose}
        onDismiss={onDismiss}
        step={step}
        header={
          <SheetHeader
            title={adding ? t('addWallet.title') : t('manageWallets.title')}
            onBack={adding ? () => setStep('wallets') : undefined}
          />
        }
        footer={
          !adding && (
            <View style={styles.footer}>
              <SheetButton
                label={t('addWallet.title')}
                onPress={() => {
                  impactFeedback();
                  setStep('add');
                }}
                style={styles.add}
                textStyle={styles.addLabel}
              />
            </View>
          )
        }
      >
        {adding ? (
          <WalletMethodList
            rows={ADD_ROWS.map(row => ({
              ...row,
              title: t(row.title),
              description: t(row.description),
            }))}
            disabledId={cloud.checking ? 'cloud' : undefined}
            // The Settings rows' icons: white in a 0.4 opacity slot
            // (SettingsRow's iconSlot).
            iconColor={colors.foreground}
            iconOpacity={0.4}
            onSelect={method => {
              if (method === 'create') {
                onCreate();
              } else if (method === 'phrase') {
                onImport();
              } else {
                cloud.start();
              }
            }}
          />
        ) : (
          <View style={styles.list}>
            {wallets.map(wallet => (
              <WalletListRow
                key={wallet.id}
                wallet={wallet}
                selected={selectedId === wallet.id}
                onSelect={() => {
                  impactFeedback();
                  selectWallet(wallet.id);
                  onClose(requestKey);
                }}
                onSettings={() => {
                  impactFeedback();
                  onSettings(wallet.id);
                }}
              />
            ))}
          </View>
        )}
      </AdaptiveSheet>
      <CloudRestoreSheet visible={visible} {...cloud.sheetProps} />
    </>
  );
}
const styles = StyleSheet.create({
  list: { paddingBottom: 32 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    padding: 16,
  },
  add: { ...buttonMetrics.primary, borderRadius: 25, paddingHorizontal: 24 },
  addLabel: {
    ...typography.walletListName,
    lineHeight: 16,
    color: colors.onButton,
  },
});
