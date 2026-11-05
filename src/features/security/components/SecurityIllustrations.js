import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors } from '../../../theme/index';
import { fonts } from '../../../theme/fonts';

const SHIELD =
  'M0 -1L1 -0.62V0.12C1 0.55 0.6 0.86 0 1.08C-0.6 0.86 -1 0.55 -1 0.12V-0.62Z';
export function Shield({ x, y, size, id }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${size})`}>
      <Defs>
        <ClipPath id={`${id}-right`}>
          <Rect x={0} y={-1.2} width={1.2} height={2.4} />
        </ClipPath>
        <LinearGradient id={`${id}-warm`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset={0} stopColor="#BFA673" />
          <Stop offset={1} stopColor="#9B7545" />
        </LinearGradient>
      </Defs>
      <Path d={SHIELD} fill="#FFFFFF" fillOpacity={0.32} />
      <G clipPath={`url(#${id}-right)`}>
        <Path d={SHIELD} fill={colors.gold} />
        <Path d="M0 -1.2H1.2V-0.62L0 0.1Z" fill="#F2E0B2" />
        <Path d="M0 0.62L1.2 -0.3V1.2H0Z" fill={`url(#${id}-warm)`} />
      </G>
    </G>
  );
}

export function PasscodeIllustration({ size = 210 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 552 618">
      <Defs>
        <LinearGradient id="passcode-gold" x1="0" y1="0" x2="1" y2="1">
          <Stop offset={0} stopColor={colors.gold} />
          <Stop offset={1} stopColor="#9B7545" />
        </LinearGradient>
      </Defs>
      <Rect
        x={160}
        y={205}
        width={82}
        height={82}
        rx={4}
        fill="none"
        stroke="#F2E0B2"
        strokeWidth={6}
      />
      <SvgText
        {...fonts.regular}
        x={201}
        y={262}
        fontSize={34}
        fill="#FFFFFF"
        fillOpacity={0.35}
        textAnchor="middle"
      >
        1
      </SvgText>
      <Rect
        x={309}
        y={354}
        width={84}
        height={84}
        rx={4}
        fill="none"
        stroke="#BFA673"
        strokeWidth={6}
      />
      <SvgText
        {...fonts.regular}
        x={351}
        y={409}
        fontSize={34}
        fill="#FFFFFF"
        fillOpacity={0.35}
        textAnchor="middle"
      >
        9
      </SvgText>
      <Rect
        x={232}
        y={277}
        width={88}
        height={88}
        rx={5}
        fill="url(#passcode-gold)"
      />
      <SvgText
        {...fonts.regular}
        x={276}
        y={334}
        fontSize={34}
        fill={colors.onGold}
        textAnchor="middle"
      >
        5
      </SvgText>
    </Svg>
  );
}
