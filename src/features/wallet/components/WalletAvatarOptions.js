import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useT } from '../../../i18n/index';
import { colors } from '../../../theme/index';
import { AvatarOptionIcon } from './AvatarOptionIcon';

export function WalletAvatarOptions({ canRemove, onSelect }) {
  const t = useT();
  const options = [
    ['library', 'walletName.pickPhoto'],
    ['camera', 'walletName.takePhoto'],
    ['emoji', 'walletName.pickEmoji'],
    ...(canRemove ? [['remove', 'walletName.removePhoto']] : []),
  ];
  return (
    <View style={styles.content}>
      {options.map(([kind, label]) => (
        <Pressable
          key={kind}
          accessibilityRole="button"
          accessibilityLabel={t(label)}
          onPress={() => onSelect(kind)}
          style={styles.row}
        >
          <AvatarOptionIcon kind={kind} />
          <Text style={styles.label}>{t(label)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  row: {
    height: 60,
    paddingHorizontal: 15,
    borderRadius: 16,
    backgroundColor: '#FFFFFF0D',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  label: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
});
