import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const IMAGE = [1035, 1590];
// prettier-ignore
const GRID = [
  '#423D32', '#413C31', '#3E3A30', '#39352E', '#35322B', '#312F29', '#2E2C27', '#2C2A26', '#2A2925',
  '#4B4537', '#494336', '#443F33', '#3F3A30', '#38342D', '#322F29', '#2D2B27', '#2A2925', '#292725',
  '#59503E', '#554D3C', '#4F4739', '#453F34', '#3B372F', '#34312B', '#2E2C28', '#2A2925', '#272624',
  '#6A5E47', '#635944', '#584F3D', '#4A4436', '#413C31', '#37342C', '#2F2D28', '#292725', '#262523',
  '#7C6E51', '#6F634A', '#5E5441', '#504839', '#433D32', '#38352D', '#2F2D28', '#292725', '#242322',
  '#7C6E51', '#70644A', '#5E5441', '#504839', '#413C32', '#37342C', '#2E2C28', '#272624', '#232221',
  '#695D47', '#635943', '#574E3D', '#4A4336', '#3E3930', '#34312B', '#2D2B27', '#252523', '#212120',
  '#584F3D', '#534B3B', '#4C4537', '#433D32', '#38352D', '#302E28', '#282724', '#232221', '#202020',
  '#494336', '#464034', '#403B31', '#39352E', '#33302A', '#2B2926', '#242322', '#212120', '#212120',
  '#3C382F', '#3A362E', '#37332C', '#312E29', '#2B2A26', '#252523', '#212120', '#212121', '#212120',
  '#34312A', '#312F29', '#2E2C27', '#292825', '#252523', '#212121', '#212121', '#212120', '#212120',
  '#2C2A27', '#292825', '#272624', '#232222', '#212120', '#212121', '#212120', '#202020', '#212120',
  '#282724', '#252523', '#232222', '#212121', '#212121', '#212120', '#212120', '#212120', '#212121',
];
const grid = GRID.flatMap(hex => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
]);
const source = Skia.RuntimeEffect.Make(`
uniform float2 size;
uniform float2 image;
uniform float3 grid[117];
half4 main(float2 p) {
  float s = max(size.x / image.x, size.y / image.y);
  float2 d = image * s;
  float2 uv = clamp((p - (size - d) * 0.5) / d, 0.0, 1.0);
  float gx = uv.x * 8.0;
  float gy = uv.y * 12.0;
  float3 c = float3(0.0);
  for (int j = 0; j < 13; j++) {
    for (int i = 0; i < 9; i++) {
      float w = max(0.0, 1.0 - abs(gx - float(i))) *
        max(0.0, 1.0 - abs(gy - float(j)));
      c += grid[j * 9 + i] * w;
    }
  }
  return half4(half3(c), 1.0);
}`);

export function SecurityBackground() {
  const [size, setSize] = useState(null);
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={({ nativeEvent }) =>
        setSize([nativeEvent.layout.width, nativeEvent.layout.height])
      }
    >
      {source && size && (
        <Canvas colorSpace="srgb" style={StyleSheet.absoluteFill}>
          <Fill>
            <Shader source={source} uniforms={{ size, image: IMAGE, grid }} />
          </Fill>
        </Canvas>
      )}
    </View>
  );
}
