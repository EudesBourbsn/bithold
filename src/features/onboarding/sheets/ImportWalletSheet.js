import { AdaptiveSheet } from '../../../components/sheets/AdaptiveSheet';
import { SheetHeader } from '../../../components/sheets/SheetHeader';
import { useT } from '../../../i18n/index';
import { colors } from '../../../theme/index';
import {
  CloudBackupIcon,
  SeedPhraseIcon,
} from '../components/ImportMethodIcons';
import { WalletMethodList } from '../components/WalletMethodList';

const ROWS = [
  {
    id: 'phrase',
    title: 'importWith.phraseTitle',
    description: 'importWith.phraseDescription',
    Icon: SeedPhraseIcon,
  },
  {
    id: 'cloud',
    title: 'importWith.cloudTitle',
    description: 'importWith.cloudDescription',
    Icon: CloudBackupIcon,
  },
];

export function ImportWalletSheet({
  visible,
  requestKey = 0,
  onClose,
  onDismiss,
  onSelect,
  disabledId,
}) {
  const t = useT();
  const rows = ROWS.map(row => ({
    ...row,
    title: t(row.title),
    description: t(row.description),
  }));
  return (
    <AdaptiveSheet
      visible={visible}
      requestKey={requestKey}
      onClose={onClose}
      onDismiss={onDismiss}
      header={<SheetHeader title={t('importWith.title')} />}
    >
      <WalletMethodList
        rows={rows}
        onSelect={onSelect}
        disabledId={disabledId}
        // The Settings rows' icons: white in a 0.4 opacity slot
        // (SettingsRow's iconSlot).
        iconColor={colors.foreground}
        iconOpacity={0.4}
      />
    </AdaptiveSheet>
  );
}
