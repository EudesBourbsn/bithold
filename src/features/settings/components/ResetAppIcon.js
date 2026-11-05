import { useId } from 'react';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '../../../theme/index';

const arrow = 'M6 7.5A7.5 7.5 0 1 1 5.1 15';
const head = 'M6 3.5v4H10';

export function ResetAppIcon({ style }) {
  const gradient = `reset${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <Svg
      width={84}
      height={84}
      viewBox="0 0 24 24"
      style={style}
      accessible={false}
    >
      <Defs>
        <LinearGradient
          id={gradient}
          x1={4}
          y1={3}
          x2={20}
          y2={22}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor={colors.foreground} />
          <Stop offset="0.45" stopColor={colors.foreground} />
          <Stop offset="1" stopColor={colors.button} />
        </LinearGradient>
      </Defs>
      <G
        fill="none"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <G stroke={colors.button} opacity={0.2} transform="translate(0 0.5)">
          <Path d={arrow} />
          <Path d={head} />
        </G>
        <G stroke={`url(#${gradient})`}>
          <Path d={arrow} />
          <Path d={head} />
        </G>
      </G>
    </Svg>
  );
}
