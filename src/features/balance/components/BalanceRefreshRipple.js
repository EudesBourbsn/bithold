import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';
import { Platform, StyleSheet, View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { refreshMotion, rippleOrigin } from '../motion/refreshMotion';

const pulse = Skia.RuntimeEffect.Make(`
  uniform float phase;
  uniform float2 origin;
  uniform float extent;
  uniform half3 tint;

  float easeUnit(float value) {
    float unit = clamp(value, 0.0, 1.0);
    return unit * unit * (3.0 - 2.0 * unit);
  }
  half4 main(float2 position) {
    float radius = phase * ${refreshMotion.speed};
    float distanceToOrigin = length(position - origin) / extent;
    float band = 1.0 - easeUnit(abs(distanceToOrigin - radius) / ${
      refreshMotion.thickness
    });
    float envelope = easeUnit((phase - ${refreshMotion.rampStart}) / ${
  refreshMotion.rampEnd - refreshMotion.rampStart
});
    envelope *= 1.0 - easeUnit(radius / ${refreshMotion.maxRadius});
    float alpha = band * envelope * ${refreshMotion.rippleAlpha};
    return half4(tint * alpha, alpha);
  }
`);
const tint = [47 / 255, 126 / 255, 195 / 255];

export function BalanceRefreshRipple({ progress, width, height }) {
  const { origin, extent } = rippleOrigin(width, height, Platform.isPad);
  const uniforms = useDerivedValue(() => ({
    phase: progress.value,
    origin,
    extent,
    tint,
  }));
  if (!pulse) {
    return null;
  }
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Fill>
          <Shader source={pulse} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}
