import Svg, { Path } from 'react-native-svg';
import { StatusIconPlate } from '../../../components/illustrations/StatusIconPlate';
import { colors } from '../../../theme/index';

export function WalletProtectionIcon() {
  return (
    <StatusIconPlate compact>
      <Svg width={84} height={84} viewBox="0 0 84 84" accessible={false}>
        <Path
          d="M42 7L68 17V39C68 56 58 69 42 77C26 69 16 56 16 39V17Z"
          fill={colors.foreground}
        />
      </Svg>
    </StatusIconPlate>
  );
}
