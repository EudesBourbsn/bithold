import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

export function PhraseSuggestions({ words, disabled, onSelect }) {
  const scroll = useRef(null);
  const suggestions = words.slice(0, 3);
  const wordList = suggestions.join(' ');
  useEffect(() => {
    scroll.current?.scrollTo({ x: 0, animated: false });
  }, [wordList]);
  return (
    <View style={styles.bar}>
      <ScrollView
        ref={scroll}
        style={styles.scroll}
        horizontal
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {suggestions.map((word, index) => (
          <Pressable
            key={word}
            accessibilityRole="button"
            accessibilityLabel={word}
            accessibilityState={{ disabled: !!disabled }}
            disabled={disabled}
            onPress={() => {
              if (!disabled) onSelect(word);
            }}
            style={[styles.suggestion, index === 0 && styles.primary]}
          >
            {index !== 0 && (
              <View pointerEvents="none" style={styles.outline} />
            )}
            <Text style={[styles.label, index === 0 && styles.primaryLabel]}>
              {word}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: 'transparent' },
  scroll: { flexGrow: 0 },
  content: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  suggestion: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: colors.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outline: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  primary: {
    backgroundColor: colors.button,
  },
  label: {
    ...fonts.medium,
    fontSize: 15,
    lineHeight: 18,
    color: colors.foreground,
  },
  primaryLabel: {
    ...fonts.semibold,
    color: colors.onButton,
  },
});
