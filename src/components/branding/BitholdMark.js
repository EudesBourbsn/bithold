import Svg, { Path } from 'react-native-svg';
import { useT } from '../../i18n/index';
import { brandMark } from './brandMark';

export function BitholdMark({ size, color = '#FFFFFF' }) {
  const t = useT();
  return (
    <Svg
      width={size}
      height={size}
      viewBox={brandMark.viewBox}
      accessibilityRole="image"
      accessibilityLabel={t('brand.logo')}
    >
      <Path d={brandMark.path} fill={color} fillRule="evenodd" />
    </Svg>
  );
}
