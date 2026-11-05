import { Pressable, StyleSheet, Text, View } from 'react-native';
import { welcomeLayout, welcomePalette } from '../theme/welcomeLayout';
import { fonts } from '../../../theme/fonts';

export function WelcomeOptionCard({
  title,
  description,
  accessory,
  onPress,
  disabled,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.card, disabled && styles.disabled]}
    >
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {accessory}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: welcomeLayout.cardRadius,
    paddingHorizontal: welcomeLayout.cardPaddingHorizontal,
    paddingVertical: welcomeLayout.cardPaddingVertical,
    borderWidth: 1,
    borderColor: welcomePalette.secondaryBorder,
    backgroundColor: welcomePalette.secondary,
  },
  copy: {
    flex: 1,
    flexShrink: 1,
    gap: welcomeLayout.cardTextGap,
    paddingEnd: welcomeLayout.cardTextInset,
  },
  title: {
    ...fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: welcomePalette.text,
  },
  description: {
    ...fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    color: welcomePalette.muted,
  },
  disabled: { opacity: 0.5 },
});
