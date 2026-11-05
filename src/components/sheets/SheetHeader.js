import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { sheetMetrics, typography } from '../../theme/index';
import { navigationMetrics } from '../../theme/navigationMetrics';
import { SheetNavigationButton } from './SheetNavigationButton';

const { header } = sheetMetrics;
const controlOffset = (navigationMetrics.controlSize - header.controlSize) / 2;
export function SheetHeader({
  title,
  onBack,
  rightIcon,
  rightLabel,
  onRight,
  right,
  children,
  contentStyle,
  titleStyle,
}) {
  return (
    <View pointerEvents="box-none" style={styles.header}>
      <Animated.View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, contentStyle]}
      >
        <View style={[styles.heading, children && styles.searchHeading]}>
          {children || (
            <Text
              accessibilityRole="header"
              numberOfLines={1}
              style={[typography.sheetTitle, styles.title, titleStyle]}
            >
              {title}
            </Text>
          )}
        </View>
        {!!onBack && (
          <SheetNavigationButton onPress={onBack} style={styles.back} />
        )}
        {!!rightIcon && (
          <SheetNavigationButton
            icon={rightIcon}
            label={rightLabel}
            onPress={onRight}
            style={[styles.control, styles.right]}
          />
        )}
        {!!right && <View style={styles.customRight}>{right}</View>}
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: { height: header.height },
  heading: {
    position: 'absolute',
    top: header.titleTop,
    height: header.titleHeight,
    left: header.titleInset,
    right: header.titleInset,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { textAlign: 'center', width: '100%' },
  searchHeading: {
    top:
      header.titleTop + (header.titleHeight - sheetMetrics.search.height) / 2,
    height: sheetMetrics.search.height,
    right: header.controlInset,
  },
  control: {
    position: 'absolute',
    top: header.controlTop - controlOffset,
    height: navigationMetrics.controlSize,
    width: navigationMetrics.controlSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    top: header.controlTop,
    left: header.controlInset,
  },
  right: { right: header.controlInset - controlOffset },
  customRight: {
    position: 'absolute',
    top: header.controlTop - controlOffset,
    right: header.controlInset - controlOffset,
    height: navigationMetrics.controlSize,
    width: navigationMetrics.controlSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
