import { Pressable, Text, View } from 'react-native';
import { StatusIconPlate } from '../../../components/illustrations/StatusIconPlate';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SheetButton } from '../../../components/sheets/SheetButton';
import { useT } from '../../../i18n/index';
import { styles } from '../styles/ResetWalletStep.styles';
import { ResetAppIcon } from './ResetAppIcon';

export function ResetWalletStep({
  confirmation,
  busy,
  onBackup,
  onCancel,
  onContinue,
}) {
  const t = useT();
  return (
    // The first step rises with its sheet; only the confirmation fades in.
    <Animated.View
      entering={confirmation ? FadeIn.duration(300) : undefined}
      style={styles.content}
    >
      <StatusIconPlate>
        <ResetAppIcon />
      </StatusIconPlate>
      <Text accessibilityRole="header" style={styles.title}>
        {t(confirmation ? 'settings.resetTitle' : 'settings.row.reset')}
      </Text>
      <Text style={styles.message}>
        {t(confirmation ? 'settings.resetWarning' : 'settings.resetMessage')}
      </Text>
      <View style={styles.actions}>
        <SheetButton
          status
          label={t(confirmation ? 'common.cancel' : 'walletSettings.backup')}
          onPress={confirmation ? onCancel : onBackup}
          disabled={busy}
          style={busy ? styles.disabledButton : styles.primaryButton}
          textStyle={busy ? styles.disabledText : styles.primaryText}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: busy, busy }}
          onPress={onContinue}
          disabled={busy}
          style={styles.secondaryButton}
        >
          <Text style={[styles.secondaryText, busy && styles.disabledText]}>
            {t('settings.resetConfirm')}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
