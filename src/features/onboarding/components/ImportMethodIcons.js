import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../../theme/index';

const SIZE = 32;
const VIEW_BOX = '-2 -4 24 24';

// Seed phrase or private key: a card with a pocket line and a key. Its bars
// end square with 0.5-unit corners. Content 20 x 18 units.
export function SeedPhraseIcon({ color = colors.gold }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox={VIEW_BOX} accessible={false}>
      <Rect x={0} y={0} width={2} height={15} rx={0.5} fill={color} />
      <Rect x={0} y={0} width={19} height={2} rx={0.5} fill={color} />
      <Rect x={0} y={13} width={12} height={2} rx={0.5} fill={color} />
      <Rect x={17} y={0} width={2} height={4} rx={0.5} fill={color} />
      <Rect x={16} y={10} width={2} height={8} rx={0.5} fill={color} />
      <Rect x={16} y={13.5} width={4} height={2} rx={0.5} fill={color} />
      <Circle cx={17} cy={9} r={2} stroke={color} strokeWidth={2} fill="none" />
      <Path
        d="M0.5 6H6C6.1 6.76 12.07 9.49 10.94 6.48"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

export function CreateWalletIcon({ color = colors.gold }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox={VIEW_BOX} accessible={false}>
      <Rect x={0} y={0} width={19} height={2} rx={0.5} fill={color} />
      <Rect x={0} y={0} width={2} height={15} rx={0.5} fill={color} />
      <Rect x={17} y={0} width={2} height={9} rx={0.5} fill={color} />
      <Rect x={0} y={13} width={12} height={2} rx={0.5} fill={color} />
      <Rect x={16} y={11} width={2} height={6} rx={0.5} fill={color} />
      <Rect x={14} y={13} width={6} height={2} rx={0.5} fill={color} />
      <Path
        d="M0 6H6.25C6.25 6 7.48 7.79 9.72 7.79C11.96 7.79 13.19 6 13.19 6H19"
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

// Cloud backup: three open arcs (centres (6, 10) r 5, (10, 6) r 5 and
// (14.77, 10.76) r 4.23) on a base line, round caps. Content 20 x 16 units.
export function CloudBackupIcon({ color = colors.gold }) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox={VIEW_BOX} accessible={false}>
      <Path
        d={[
          'M5.88 15H15.24',
          'M5.142 14.926A5 5 0 1 1 10.641 8.139',
          'M5.359 4.141A5 5 0 0 1 14.998 6.137',
          'M14.873 6.531A4.23 4.23 0 0 1 15.802 14.862',
        ].join('')}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
