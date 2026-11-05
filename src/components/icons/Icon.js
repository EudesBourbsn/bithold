import {
  requireNativeComponent,
  View,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import { navigationMetrics } from '../../theme/navigationMetrics';
import { iconSources } from './iconSources';

export const NativeSymbol =
  Platform.OS === 'ios' ? requireNativeComponent('BitholdSymbol') : View;

function MaterialGlyph({ value, size, color }) {
  return (
    <Text
      accessible={false}
      selectable={false}
      allowFontScaling={false}
      style={[styles.materialGlyph, { fontSize: size, color }]}
    >
      {value}
    </Text>
  );
}

export function BackGlyph({ color = '#FFFFFF' }) {
  return (
    <Svg
      width={navigationMetrics.backIconSize}
      height={navigationMetrics.backIconSize}
      viewBox="0 0 24 24"
      accessible={false}
    >
      <Path
        d="M22 12H2M9 19L2 12L9 5"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function Icon({ name, size = 24, color = '#FFFFFF' }) {
  if (name === 'back' || name === 'backArrow') {
    return <BackGlyph color={color} />;
  }
  if (name === 'more') {
    return (
      <MaterialGlyph
        value={'\uE5D3'}
        size={navigationMetrics.moreIconSize}
        color={color}
      />
    );
  }
  if (iconSources[name]) {
    return <SvgXml xml={iconSources[name]} width={size} height={size} />;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="m7 10 5 5 5-5"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  materialGlyph: {
    fontFamily: 'Material Icons',
    fontWeight: 'normal',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
});
