import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { impactFeedback } from '../../../services/feedback';
import { buttonMetrics } from '../../../theme/buttonMetrics';
import { fonts } from '../../../theme/fonts';

export function GradientAction({
  label,
  onPress,
  onLongPress,
  delayLongPress,
  width,
  inset = 0,
  disabled = false,
  style,
}) {
  const [measured, setMeasured] = useState(0);
  const boxWidth = width ?? measured;
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={20}
      delayLongPress={delayLongPress}
      onLongPress={onLongPress}
      onPress={() => {
        impactFeedback();
        onPress?.();
      }}
      onLayout={({ nativeEvent }) =>
        setMeasured(nativeEvent.layout.width - 2 * inset)
      }
      style={[
        width != null && { width: width + 2 * inset },
        inset > 0 && { paddingHorizontal: inset },
        styles.box,
        style,
      ]}
    >
      {boxWidth > 0 && (
        <Svg width={boxWidth} height={26} accessible={false}>
          <Defs>
            <LinearGradient
              id="gradient-action"
              x1={0}
              y1={0}
              x2={boxWidth}
              y2={0}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset={0} stopColor="#BFA673" />
              <Stop offset={1} stopColor="#E8D09B" />
            </LinearGradient>
          </Defs>
          <SvgText
            x={boxWidth / 2}
            y={20}
            {...fonts.regular}
            fontSize={20}
            letterSpacing={0}
            textAnchor="middle"
            fill="url(#gradient-action)"
          >
            {label}
          </SvgText>
        </Svg>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    ...buttonMetrics.primary,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
