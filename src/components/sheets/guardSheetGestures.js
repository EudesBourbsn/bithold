export function guardSheetGestures(handlers, state, onCatch) {
  const { committedClosing, isClosing, blockedGesture } = state;
  return {
    handleOnStart(source, event) {
      'worklet';
      blockedGesture.value = committedClosing.value;
      if (blockedGesture.value) {
        return;
      }
      if (isClosing.value) {
        isClosing.value = false;
        onCatch();
      }
      handlers.handleOnStart(source, event);
    },
    handleOnChange(source, event) {
      'worklet';
      if (committedClosing.value || blockedGesture.value) {
        return;
      }
      handlers.handleOnChange(source, event);
    },
    handleOnEnd(source, event) {
      'worklet';
      if (committedClosing.value || blockedGesture.value) {
        return;
      }
      handlers.handleOnEnd(source, event);
    },
    handleOnFinalize(source, event) {
      'worklet';
      if (committedClosing.value || blockedGesture.value) {
        return;
      }
      handlers.handleOnFinalize(source, event);
    },
  };
}
