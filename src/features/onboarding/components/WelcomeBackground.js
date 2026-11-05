import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { welcomeFlares, welcomePalette } from '../theme/welcomeLayout';

const tone = index => {
  const mix = Math.min(index / 5, 1);
  const [r, g, b] = welcomePalette.flareCore.map(
    (core, channel) => core + (welcomePalette.flareEdge[channel] - core) * mix,
  );
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};
const STOP_COLORS = welcomeFlares.opacities.map((_, index) => tone(index));

export function WelcomeBackground() {
  const { width } = useWindowDimensions();
  const scale = width / welcomeFlares.designWidth;
  const flareWidth = welcomeFlares.width * scale;
  const flareHeight = welcomeFlares.height * scale;
  const edge = welcomeFlares.edgeOffset * scale;
  const left = (width - flareWidth) / 2;

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.background}
    >
      {['top', 'bottom'].map(side => (
        <View key={side} style={[styles.flare, { [side]: edge, left }]}>
          <Svg width={flareWidth} height={flareHeight}>
            <Defs>
              <RadialGradient
                id={`welcome-${side}`}
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
              >
                {welcomeFlares.opacities.map((opacity, index) => (
                  <Stop
                    key={index}
                    offset={index / 10}
                    stopColor={STOP_COLORS[index]}
                    stopOpacity={opacity}
                  />
                ))}
              </RadialGradient>
            </Defs>
            <Rect
              width={flareWidth}
              height={flareHeight}
              fill={`url(#welcome-${side})`}
            />
          </Svg>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  flare: { position: 'absolute' },
});
