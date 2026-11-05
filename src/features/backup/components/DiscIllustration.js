import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Oval,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { Platform, StyleSheet, View } from 'react-native';
import { NativeSymbol } from '../../../components/icons/Icon';
import { colors } from '../../../theme';

const SIZE = 120;
const ART_WIDTH = SIZE * 1.4166666666666667;
const ART_HEIGHT = SIZE * 1.4595999999999998;
const ART_LEFT = (SIZE - ART_WIDTH) / 2;
const px = value => value / 3;

const CX = px(254.5);
const FACE_HEIGHT = px(344);
const FACE_STOPS = [
  [0, '#F3F0C7'],
  [8, '#DDD4A0'],
  [16, '#D6CB95'],
  [24, '#CBBB87'],
  [32, '#C7B17D'],
  [48, '#C7AF79'],
  [72, '#C2A974'],
  [96, '#C0A670'],
  [128, '#BEA26B'],
  [248, '#C6AF7B'],
  [272, '#CBB783'],
  [296, '#D1BF8D'],
  [320, '#D4C495'],
  [336, '#DACB9C'],
  [344, '#EAE0B9'],
];

const GLYPH_VIEW = 54;

const COIN = px(37);
const BACK = { x: px(240.5), y: px(158) };
const FRONT = { x: px(272), y: px(185) };
const RIM = px(9);
const GAP = px(9);

const coinCut = Skia.PathBuilder.Make()
  .addCircle(FRONT.x, FRONT.y, COIN + GAP)
  .addCircle(FRONT.x, FRONT.y + RIM, COIN + GAP)
  .build();
const faceColors = ['rgba(5, 5, 5, 0.85)', 'rgba(5, 5, 5, 0.69)'];

function Coin({ x, y }) {
  return (
    <>
      <Circle cx={x} cy={y + RIM} r={COIN} color={colors.onGold} />
      <Circle cx={x} cy={y} r={COIN} color={colors.foreground} />
      <Circle cx={x} cy={y} r={COIN}>
        <LinearGradient
          start={vec(x, y - COIN)}
          end={vec(x, y + COIN)}
          colors={faceColors}
        />
      </Circle>
    </>
  );
}

// symbol: an SF Symbol drawn on the disc in place of a glyph (iOS).
export function DiscIllustration({
  glyph = 'pencil',
  symbol,
  children,
  faceStops = FACE_STOPS,
  rimColor = 'rgba(229, 220, 183, 0.914)',
  edgeColor = 'rgba(244, 240, 202, 0.5)',
}) {
  const symbolName = symbol ?? (glyph === 'pencil' ? 'pencil' : null);
  return (
    <View style={styles.box} accessibilityElementsHidden>
      <Canvas style={styles.art}>
        <Circle cx={CX} cy={px(267)} r={60} color="rgba(0, 0, 0, 0.149)">
          <BlurMask blur={12.3} style="normal" />
        </Circle>
        <Circle cx={CX} cy={60} r={60} color={rimColor} />
        <Oval x={CX - 60} y={0} width={120} height={FACE_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, FACE_HEIGHT)}
            colors={faceStops.map(stop => stop[1])}
            positions={faceStops.map(stop => stop[0] / 344)}
          />
        </Oval>
        <Oval
          x={CX - 60 + 0.67}
          y={0.67}
          width={120 - 1.33}
          height={FACE_HEIGHT - 1.33}
          style="stroke"
          strokeWidth={1.33}
          color={edgeColor}
        />
        {glyph === 'coins' && (
          <>
            <Circle
              cx={FRONT.x}
              cy={FRONT.y + RIM + 2}
              r={COIN}
              color="rgba(0, 0, 0, 0.17)"
            >
              <BlurMask blur={2} style="normal" />
            </Circle>
            <Group clip={coinCut} invertClip>
              <Coin x={BACK.x} y={BACK.y} />
            </Group>
            <Coin x={FRONT.x} y={FRONT.y} />
          </>
        )}
      </Canvas>
      {!!children && (
        <View style={[styles.glyphShadow, styles.symbolCentre]}>
          {children}
        </View>
      )}
      {!children && !!symbolName && Platform.OS === 'ios' && (
        <View style={[styles.glyphShadow, symbol && styles.symbolCentre]}>
          <NativeSymbol
            symbolName={symbolName}
            pointSize={GLYPH_VIEW}
            weight="medium"
            tintColor={colors.onGold}
            style={styles.glyph}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    width: SIZE,
    height: SIZE,
  },
  art: {
    position: 'absolute',
    left: ART_LEFT,
    top: 0,
    width: ART_WIDTH,
    height: ART_HEIGHT,
  },

  glyphShadow: {
    position: 'absolute',
    left: 57.67 - GLYPH_VIEW / 2,
    top: 55.17 - GLYPH_VIEW / 2,
    width: GLYPH_VIEW,
    height: GLYPH_VIEW,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  // A symbol sits on the face's centre (the pencil is drawn off it).
  symbolCentre: {
    left: 59.83 - GLYPH_VIEW / 2,
    top: 57.33 - GLYPH_VIEW / 2,
  },
  glyph: {
    width: GLYPH_VIEW,
    height: GLYPH_VIEW,
    opacity: 0.75,
  },
});
