import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '../../../theme/fonts';

const characters = Array.from('0123456789.');
const measurementSize = 88;

export function AmountGlyphMetrics({ onMeasured }) {
  const widths = useRef({});
  const completed = useRef(false);
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      {characters.map(character => (
        <Text
          key={character}
          style={styles.glyph}
          onTextLayout={({ nativeEvent }) => {
            const width = nativeEvent.lines[0]?.width;
            if (completed.current || !Number.isFinite(width) || width <= 0) {
              return;
            }
            widths.current[character] = width / measurementSize;
            if (Object.keys(widths.current).length === characters.length) {
              completed.current = true;
              onMeasured(widths.current);
            }
          }}
        >
          {character}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1000,
    height: 1000,
    opacity: 0,
    overflow: 'hidden',
  },
  glyph: {
    ...fonts.semibold,
    position: 'absolute',
    fontSize: measurementSize,
    letterSpacing: 0,
  },
});
