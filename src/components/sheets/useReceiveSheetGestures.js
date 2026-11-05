import {
  ANIMATION_SOURCE,
  GESTURE_SOURCE,
  useBottomSheetInternal,
  useGestureEventsHandlersDefault,
} from '@gorhom/bottom-sheet';
import { useCallback, useContext, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { guardSheetGestures } from './guardSheetGestures';
import { SheetGestureLifecycleContext } from './SheetGestureLifecycleContext';

const dismissKeyboard = Keyboard.dismiss;

export function useReceiveSheetGestures() {
  const handlers = useGestureEventsHandlersDefault();
  const {
    isClosing,
    committedClosing,
    catchClosingGesture,
    dragThresholdHeight,
  } = useContext(SheetGestureLifecycleContext);
  const blockedGesture = useSharedValue(false);
  const {
    animatedScrollableState,
    animatedDetentsState,
    enablePanDownToClose,
    animateToPosition,
  } = useBottomSheetInternal();
  const onStart = handlers.handleOnStart;
  const onEnd = handlers.handleOnEnd;
  const handleOnStart = useCallback(
    (source, event) => {
      'worklet';
      runOnJS(dismissKeyboard)();
      onStart(source, event);
    },
    [onStart],
  );
  const handleOnEnd = useCallback(
    (source, event) => {
      'worklet';
      const contentOffset = animatedScrollableState.get().contentOffsetY;
      const contentOwnsGesture =
        source !== GESTURE_SOURCE.HANDLE && contentOffset > 0;
      const closedPosition = animatedDetentsState.get().closedDetentPosition;
      if (
        !contentOwnsGesture &&
        enablePanDownToClose &&
        event.translationY > 0 &&
        closedPosition != null &&
        (event.velocityY > 800 ||
          event.translationY > dragThresholdHeight * 0.22)
      ) {
        animateToPosition(
          closedPosition,
          ANIMATION_SOURCE.GESTURE,
          event.velocityY,
        );
        return;
      }

      const projectionOffset =
        source === GESTURE_SOURCE.CONTENT ? Math.max(0, contentOffset) : 0;
      onEnd(
        source,
        projectionOffset > 0
          ? { ...event, translationY: event.translationY + projectionOffset }
          : event,
      );
    },
    [
      animatedScrollableState,
      animatedDetentsState,
      enablePanDownToClose,
      dragThresholdHeight,
      animateToPosition,
      onEnd,
    ],
  );
  const onCatch = useCallback(() => {
    'worklet';
    runOnJS(catchClosingGesture)();
  }, [catchClosingGesture]);
  return useMemo(
    () =>
      guardSheetGestures(
        { ...handlers, handleOnStart, handleOnEnd },
        { isClosing, committedClosing, blockedGesture },
        onCatch,
      ),
    [
      handlers,
      handleOnStart,
      handleOnEnd,
      isClosing,
      committedClosing,
      blockedGesture,
      onCatch,
    ],
  );
}
