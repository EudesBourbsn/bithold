import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';

export function recoveryRowPadding({
  availableHeight,
  wordCount,
  fontScale = 1,
  preferredPadding = 10,
}) {
  const rows = Math.ceil(wordCount / 2);
  if (!rows) return preferredPadding;
  const textHeight = 28 * Math.min(fontScale, 1.3);
  return Math.max(
    0,
    Math.min(preferredPadding, (availableHeight / rows - textHeight - 1) / 2),
  );
}

export function RecoveryWords({ words, rowPadding = 10 }) {
  const half = Math.ceil(words.length / 2);
  return (
    <View style={styles.columns}>
      {[0, half].map(start => (
        <View key={start} style={styles.column}>
          {words.slice(start, start + half).map((word, index) => (
            <View
              key={start + index}
              style={[styles.row, { paddingVertical: rowPadding }]}
            >
              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={1.3}
                style={styles.number}
              >
                {start + index + 1}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                maxFontSizeMultiplier={1.3}
                selectable={false}
                style={styles.word}
              >
                {word}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  columns: {
    flexDirection: 'row',
    direction: 'ltr',
    paddingHorizontal: 20,
    gap: 16,
  },
  column: { flex: 1, minWidth: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  number: {
    width: 28,
    flexShrink: 0,
    marginRight: 8,
    color: '#FFFFFF80',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
    writingDirection: 'ltr',
  },
  word: {
    flex: 1,
    minWidth: 0,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
