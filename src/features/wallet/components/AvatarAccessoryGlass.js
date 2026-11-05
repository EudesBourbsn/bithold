import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { transactionGlassPath } from '../../activity/theme/transactionVisuals';

const width = 48;
const height = 40;
const radius = 20;
const arc = transactionGlassPath(width, height, radius);

export function AvatarAccessoryGlass({ color, manual = false }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const first = '#5F5F7B';
  const second = manual ? first : color;
  return (
    <View pointerEvents="none" style={styles.clip}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient
            id={`avatarTint${id}`}
            x1={width}
            y1={height}
            x2={0}
            y2={0}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0.3" stopColor={first} stopOpacity={0.97} />
            <Stop offset="0.8" stopColor={second} stopOpacity={0.97} />
          </LinearGradient>
          <LinearGradient
            id={`avatarOverlay${id}`}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0" stopColor={second} stopOpacity={0.97} />
            <Stop offset="1" stopColor={first} stopOpacity={0.97} />
          </LinearGradient>
          <RadialGradient
            id={`avatarHorizontal${id}`}
            cx="120%"
            r={20}
            fx="120%"
          >
            <Stop offset="20%" stopColor="black" stopOpacity={0.15} />
            <Stop offset="60%" stopColor="black" stopOpacity={0.2} />
            <Stop offset="100%" stopColor="black" stopOpacity={0.3} />
          </RadialGradient>
          <LinearGradient
            id={`avatarVertical${id}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="black" stopOpacity={0.3} />
            <Stop offset="43%" stopColor="black" stopOpacity={0.2} />
            <Stop offset="80%" stopColor="black" stopOpacity={0.15} />
          </LinearGradient>
          <LinearGradient
            id={`avatarTop${id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0" stopColor="white" stopOpacity={0.8} />
            <Stop offset="1" stopColor="white" stopOpacity={0.4} />
          </LinearGradient>
          <LinearGradient
            id={`avatarBottom${id}`}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0" stopColor="white" stopOpacity={0.7} />
            <Stop offset="1" stopColor="white" stopOpacity={0.35} />
          </LinearGradient>
        </Defs>
        <Rect
          width={width}
          height={height}
          rx={radius}
          fill={`url(#avatarTint${id})`}
        />
        <Rect
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="black"
          opacity={0.1}
        />
        <Rect
          x={0.5}
          y={0.5}
          width={47}
          height={39}
          rx={radius}
          ry={radius}
          stroke={`url(#avatarOverlay${id})`}
          strokeWidth={4}
          fill="none"
          opacity={0.4}
        />
        <Rect width={20} height={40} fill={`url(#avatarHorizontal${id})`} />
        <Rect x={20} width={8} height={20} fill={`url(#avatarVertical${id})`} />
        <Rect
          width={20}
          height={40}
          translateX={28}
          rotation={180}
          originX={10}
          originY={20}
          fill={`url(#avatarHorizontal${id})`}
        />
        <Rect
          translateX={20}
          width={8}
          height={20}
          rotation={180}
          originX={4}
          originY={20}
          fill={`url(#avatarVertical${id})`}
        />
        <Path
          d={arc}
          stroke={`url(#avatarTop${id})`}
          strokeWidth={1}
          fill="none"
        />
        <Path
          d={arc}
          originX={24}
          originY={20}
          rotation={180}
          stroke={`url(#avatarBottom${id})`}
          strokeWidth={1}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    position: 'absolute',
    left: 0,
    top: 0,
    width,
    height,
    borderRadius: radius,
    overflow: 'hidden',
  },
});
