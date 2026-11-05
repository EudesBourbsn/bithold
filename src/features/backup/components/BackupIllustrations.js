import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../../theme/index';
import { Shield } from '../../security/components/SecurityIllustrations';

function Art({ box, height, children }) {
  const [, , width, tall] = box;
  return (
    <Svg
      width={(height * width) / tall}
      height={height}
      viewBox={box.join(' ')}
    >
      {children}
    </Svg>
  );
}

// Protect your wallet / Allow Access / Enable Passkeys: the shield.
export function ProtectArt({ height = 112 }) {
  return (
    <Art box={[0, 0, 108, 112]} height={height}>
      <Shield x={54} y={54} size={52} id="protect-art-shield" />
    </Art>
  );
}

// You're protected: the shield with its check, on its own.
export function ProtectedArt({ height = 112 }) {
  return (
    <Art box={[46, 50, 164, 171]} height={height}>
      <Shield x={128} y={132} size={80} id="protected-art-shield" />
      <Path
        d="M105.5 135.3L123.8 153.7L157.2 120.3"
        fill="none"
        stroke={colors.onGold}
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Art>
  );
}

// Something Went Wrong: the shield with an exclamation mark.
export function WarningArt({ height = 112 }) {
  return (
    <Art box={[48.5, 38, 128, 133]} height={height}>
      <Shield x={112.5} y={102} size={62} id="warning-art-shield" />
      <Rect
        x={106.5}
        y={66}
        width={12}
        height={52}
        rx={6}
        fill={colors.onGold}
      />
      <Circle cx={112.5} cy={136} r={7} fill={colors.onGold} />
    </Art>
  );
}
