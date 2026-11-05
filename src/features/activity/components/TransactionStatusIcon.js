import Svg, { Path } from 'react-native-svg';
import { colors } from '../../../theme/index';
import { TransactionLoadingDots } from './TransactionLoadingDots';

const directions = {
  received: 'M4 6V12H10M11.8346 4.16797L4.66797 11.3346',
  sent: 'M6.0013 4H12.0013V10M12.0013 4L4.16797 11.8333',
};

export function TransactionStatusIcon({
  received = false,
  pending = false,
  size = 16,
}) {
  if (pending) return <TransactionLoadingDots size={3} />;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      accessible={false}
    >
      <Path
        d={received ? directions.received : directions.sent}
        stroke={colors.foreground}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
