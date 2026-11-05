import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useT } from '../../../i18n/index';
import { selectionFeedback } from '../../../services/feedback';
import { colors } from '../../../theme/index';
import { getWalletEmoji, walletEmojis } from '../data/walletProfile';
import { WalletProfileFace } from './WalletProfileAvatar';

export function WalletEmojiPicker({ icon, color, onSave, disabled = false }) {
  const t = useT();
  const [selection, setSelection] = useState(
    getWalletEmoji(icon) ? icon : walletEmojis[0].icon,
  );
  return (
    <View style={styles.content}>
      <View style={styles.preview}>
        <WalletProfileFace icon={selection} color={color} size={120} />
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {t('walletName.pickEmoji')}
      </Text>
      <View style={styles.grid}>
        {[0, 1, 2].map(row => (
          <View key={row} style={styles.row}>
            {walletEmojis.slice(row * 7, row * 7 + 7).map(item => (
              <Pressable
                key={item.icon}
                accessibilityRole="button"
                accessibilityLabel={item.value}
                accessibilityState={{
                  selected: selection === item.icon,
                  disabled,
                }}
                disabled={disabled}
                onPress={() => {
                  setSelection(item.icon);
                  selectionFeedback();
                }}
                style={[
                  styles.cell,
                  selection === item.icon && styles.selected,
                ]}
              >
                <Text style={styles.emoji}>{item.value}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
      <PrimaryButton
        label={t('common.save')}
        disabled={disabled}
        onPress={() => onSave(selection)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 10, gap: 24 },
  preview: { alignItems: 'center', height: 150, justifyContent: 'center' },
  title: {
    color: colors.foreground,
    fontSize: 25,
    fontWeight: '600',
    letterSpacing: -0.25,
    textAlign: 'center',
  },
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  selected: { backgroundColor: '#FFFFFF52' },
  emoji: { fontSize: 28, color: colors.foreground },
});
