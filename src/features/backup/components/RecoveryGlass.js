import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

function glassArc(width, height, radius) {
  const left = height / 2 === radius ? 0 : 1;
  const y = height < 60 ? 0.5 : 1;
  const points = [
    [radius, height + 1],
    [left, height + 1],
    [left, y],
    [width + 1, y],
    [width + 1, height / 2],
  ];
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, py] = points[i];
    const a = [points[i - 1][0] - x, points[i - 1][1] - py];
    const b = [points[i + 1][0] - x, points[i + 1][1] - py];
    const al = Math.hypot(...a),
      bl = Math.hypot(...b),
      r = Math.min(radius, al, bl);
    if (r <= 0) {
      path += ` L ${x} ${py}`;
      continue;
    }
    const start = [x + (a[0] / al) * r, py + (a[1] / al) * r];
    const end = [x + (b[0] / bl) * r, py + (b[1] / bl) * r];
    const sweep = a[0] * b[1] - a[1] * b[0] < 0 ? 1 : 0;
    path += ` L ${start[0]} ${start[1]} A ${r} ${r} 0 0 ${sweep} ${end[0]} ${end[1]}`;
  }
  return path + ` L ${points.at(-1)[0]} ${points.at(-1)[1]}`;
}

export function RecoveryGlass({
  width,
  height,
  radius,
  top = 0.3,
  bottom = 0.2,
  tint = 'rgba(255,255,255,0.05)',
}) {
  const arc = glassArc(width, height, radius);
  return (
    <Svg
      pointerEvents="none"
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <LinearGradient id="topGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0" stopColor="#FFF" stopOpacity={top} />
          <Stop offset="1" stopColor="#FFF" stopOpacity={top * 0.5} />
        </LinearGradient>
        <LinearGradient id="bottomGlow" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0" stopColor="#FFF" stopOpacity={bottom} />
          <Stop offset="1" stopColor="#FFF" stopOpacity={bottom * 0.5} />
        </LinearGradient>
      </Defs>
      <Rect width={width} height={height} rx={radius} fill={tint} />
      <Path d={arc} stroke="url(#topGlow)" strokeWidth={1} fill="none" />
      <Path
        d={arc}
        originX={width / 2}
        originY={height / 2}
        rotation={180}
        stroke="url(#bottomGlow)"
        strokeWidth={1}
        fill="none"
      />
    </Svg>
  );
}
