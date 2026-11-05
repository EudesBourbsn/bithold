import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import {
  transactionGlassArc,
  transactionGlassPath,
  transactionGlassTint,
} from '../theme/transactionVisuals';

function stopProps(color) {
  const match =
    /^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/.exec(
      color,
    );
  return match
    ? {
        stopColor: `rgb(${match[1]}, ${match[2]}, ${match[3]})`,
        stopOpacity: Number(match[4]),
      }
    : { stopColor: color, stopOpacity: 1 };
}
export function TransactionGlass({
  width,
  height,
  radius,
  tintColors = transactionGlassTint,
  arcColor = transactionGlassArc,
  glowTop = 0.3,
  glowBottom = 0.2,
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const path = transactionGlassPath(width, height, radius);
  if (!path || width <= 0 || height <= 0) {
    return null;
  }
  return (
    <View
      pointerEvents="none"
      style={[styles.clip, { width, height, borderRadius: radius }]}
    >
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient
            id={`tint${id}`}
            x1={width}
            y1={height}
            x2={0}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" {...stopProps(tintColors[0])} />
            <Stop offset="1" {...stopProps(tintColors[1])} />
          </LinearGradient>
          <LinearGradient id={`topGlow${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0" stopColor={arcColor} stopOpacity={glowTop} />
            <Stop offset="1" stopColor={arcColor} stopOpacity={glowTop * 0.5} />
          </LinearGradient>
          <LinearGradient
            id={`bottomGlow${id}`}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0" stopColor={arcColor} stopOpacity={glowBottom} />
            <Stop
              offset="1"
              stopColor={arcColor}
              stopOpacity={glowBottom * 0.5}
            />
          </LinearGradient>
        </Defs>
        <Rect
          width={width}
          height={height}
          rx={radius}
          fill={`url(#tint${id})`}
        />
        <Path
          d={path}
          stroke={`url(#topGlow${id})`}
          strokeWidth={1}
          fill="none"
        />
        <Path
          d={path}
          originX={width / 2}
          originY={height / 2}
          rotation={180}
          stroke={`url(#bottomGlow${id})`}
          strokeWidth={1}
          fill="none"
        />
      </Svg>
    </View>
  );
}
const styles = StyleSheet.create({
  clip: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});
