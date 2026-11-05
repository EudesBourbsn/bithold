import {
  ANIMATION_SOURCE,
  GESTURE_SOURCE,
  useBottomSheetInternal,
  useGestureEventsHandlersDefault,
} from '@gorhom/bottom-sheet';
import { useCallback, useContext, useMemo } from 'react';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { guardSheetGestures } from './guardSheetGestures';
import { SheetGestureLifecycleContext } from './SheetGestureLifecycleContext';

export function useSheetHostGestures() {
  const handlers = useGestureEventsHandlersDefault();
  const { isClosing, committedClosing, catchClosingGesture } = useContext(
    SheetGestureLifecycleContext,
  );
  const blockedGesture = useSharedValue(false);
  const onCatch = useCallback(() => {
    'worklet';
    runOnJS(catchClosingGesture)();
  }, [catchClosingGesture]);
  const {
    animatedScrollableState,
    animatedDetentsState,
    animatedLayoutState,
    enablePanDownToClose,
    animateToPosition,
  } = useBottomSheetInternal();
  const onEnd = handlers.handleOnEnd;
  const handleOnEnd = useCallback(
    (source, event) => {
      'worklet';
      const contentOwnsGesture =
        source !== GESTURE_SOURCE.HANDLE &&
        animatedScrollableState.get().contentOffsetY > 0;
      const closedPosition = animatedDetentsState.get().closedDetentPosition;
      if (
        !contentOwnsGesture &&
        enablePanDownToClose &&
        event.translationY > 0 &&
        closedPosition != null &&
        (event.velocityY > 800 ||
          event.translationY > animatedLayoutState.get().containerHeight * 0.22)
      ) {
        animateToPosition(
          closedPosition,
          ANIMATION_SOURCE.GESTURE,
          event.velocityY,
        );
        return;
      }
      onEnd(source, event);
    },
    [
      animatedScrollableState,
      animatedDetentsState,
      animatedLayoutState,
      enablePanDownToClose,
      animateToPosition,
      onEnd,
    ],
  );
  return useMemo(() => {
    const coordinated = { ...handlers, handleOnEnd };
    return guardSheetGestures(
      coordinated,
      { isClosing, committedClosing, blockedGesture },
      onCatch,
    );
  }, [
    handlers,
    handleOnEnd,
    isClosing,
    committedClosing,
    blockedGesture,
    onCatch,
  ]);
}
