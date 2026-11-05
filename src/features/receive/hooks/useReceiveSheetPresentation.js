import { useMemo } from 'react';
import { NativeModules, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { receiveSheetSpring } from '../../../components/sheets/motion/receiveSheetSpring';
import { useReceiveSheetGestures } from '../../../components/sheets/useReceiveSheetGestures';

export function useReceiveSheetPresentation() {
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const deviceRadius = NativeModules.BitholdFeedback?.screenCornerRadius;
  const bottomCornerRadius =
    Number.isFinite(deviceRadius) && deviceRadius > 0 ? deviceRadius : 30;
  return useMemo(
    () => ({
      animationConfigs: receiveSheetSpring,
      gestureEventsHandlersHook: useReceiveSheetGestures,
      containerTopInset: 0,
      dragThresholdHeight: height - top,
      keyboardBehavior: 'interactive',
      keyboardBlurBehavior: 'none',
      enableBlurKeyboardOnGesture: false,
      bottomCornerRadius,
      minimumBottomInset: 30,
    }),
    [height, top, bottomCornerRadius],
  );
}
