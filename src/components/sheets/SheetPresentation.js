import { createContext, useEffect, useLayoutEffect, useRef } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export const SheetPresentationContext = createContext('native');

export function InlineSheetPresentation({
  visible,
  onShow,
  onDismiss,
  onRequestClose,
  interactionStyle,
  children,
}) {
  const shown = useRef(false);
  const callbacks = useRef(null);
  callbacks.current = { onShow, onDismiss, onRequestClose };
  useLayoutEffect(() => {
    if (!visible && shown.current) {
      shown.current = false;

      callbacks.current.onDismiss();
    }
  }, [visible]);
  useEffect(() => {
    if (!visible) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        callbacks.current.onRequestClose();
        return true;
      },
    );
    return () => subscription.remove();
  }, [visible]);
  if (!visible) {
    return null;
  }
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, interactionStyle]}
      accessibilityViewIsModal
      onAccessibilityEscape={onRequestClose}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        if (!shown.current && width > 0 && height > 0) {
          shown.current = true;
          callbacks.current.onShow();
        }
      }}
    >
      {children}
    </Animated.View>
  );
}
