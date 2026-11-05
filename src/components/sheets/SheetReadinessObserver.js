import { useBottomSheetInternal } from '@gorhom/bottom-sheet';
import {
  useAnimatedReaction,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

export function SheetReadinessObserver({ onReady }) {
  const { animatedLayoutState, animatedDetentsState } =
    useBottomSheetInternal();
  const notified = useSharedValue(false);
  useAnimatedReaction(
    () => {
      const layout = animatedLayoutState.get();
      const detents = animatedDetentsState.get().detents;
      return (
        layout.containerHeight > 0 &&
        layout.handleHeight >= 0 &&
        !!detents?.length &&
        detents.every(Number.isFinite)
      );
    },
    ready => {
      if (ready && !notified.value) {
        notified.value = true;
        runOnJS(onReady)();
      }
    },
    [onReady],
  );
  return null;
}
