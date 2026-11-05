import { Image, StyleSheet, View } from 'react-native';

export const statusPlateMetrics = Object.freeze({
  width: 638 / 3,
  height: 219,
  discHeight: 451 / 3,
  iconSize: 84,
  shadowOverlap: 86 / 3,
});

export function StatusIconPlate({
  children,
  compact = false,
  discSize = statusPlateMetrics.discHeight,
  iconSize = statusPlateMetrics.iconSize,
  reserveShadow = true,
}) {
  const scale = discSize / statusPlateMetrics.discHeight;
  const width = statusPlateMetrics.width * scale;
  const height = statusPlateMetrics.height * scale;
  const marginBottom = compact ? -statusPlateMetrics.shadowOverlap * scale : 0;
  return (
    <View
      accessible={false}
      style={[
        styles.container,
        {
          width,
          height: reserveShadow ? height : discSize,
          marginBottom,
        },
      ]}
    >
      <Image
        source={require('../../../assets/illustrations/status/icon-plate.png')}
        style={[styles.plate, { width, height }]}
        resizeMode="contain"
      />
      <View
        style={[
          styles.symbol,
          {
            top: (discSize - iconSize) / 2,
            width: iconSize,
            height: iconSize,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { alignSelf: 'center', alignItems: 'center' },
  plate: { position: 'absolute', top: 0, left: 0 },
  symbol: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
