import {
  SCROLLABLE_STATUS,
  useBottomSheetInternal,
  useScrollEventsHandlersDefault,
} from '@gorhom/bottom-sheet';
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';
import { PixelRatio, StyleSheet, View } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SheetHost } from '../../../components/sheets/SheetHost';
import { sheetMetrics } from '../../../theme/index';

const HeaderContext = createContext(null);
const ScrollChromeContext = createContext(null);

const settingsPresentation = { surfaceBottomInset: 0 };

function FloatingHeader() {
  const { header, headerStyle } = useContext(HeaderContext);
  return (
    <View pointerEvents="box-none" style={styles.header}>
      {React.cloneElement(header, { contentStyle: headerStyle })}
    </View>
  );
}

function useSettingsScrollEvents(ref, scrollableOffset) {
  const pixelScale = PixelRatio.get();
  const handlers = useScrollEventsHandlersDefault(ref, scrollableOffset);
  const { animatedScrollableStatus } = useBottomSheetInternal();
  const { offset, opacity, fadeHeader, headerShown } =
    useContext(ScrollChromeContext);
  const onScroll = handlers.handleOnScroll;
  const handleOnScroll = useCallback(
    (event, context) => {
      'worklet';
      onScroll(event, context);
      if (!fadeHeader.value) {
        return;
      }
      const maximumOffset = Math.max(
        0,
        Math.round(
          (event.contentSize.height - event.layoutMeasurement.height) *
            pixelScale,
        ) / pixelScale,
      );
      if (maximumOffset === 0) {
        offset.value = 0;
        if (!headerShown.value) {
          headerShown.value = true;
          opacity.value = withTiming(1);
        }
        return;
      }

      const committedOffset =
        animatedScrollableStatus.value === SCROLLABLE_STATUS.UNLOCKED
          ? event.contentOffset.y
          : scrollableOffset.value;
      const y = Math.min(
        maximumOffset,
        Math.max(0, Math.round(committedOffset * pixelScale) / pixelScale),
      );
      const previous = offset.value;
      offset.value = y;
      const shouldShow =
        y <= 0 || (y === previous ? headerShown.value : y < previous);
      if (shouldShow !== headerShown.value) {
        headerShown.value = shouldShow;
        opacity.value = withTiming(shouldShow ? 1 : 0);
      }
    },
    [
      onScroll,
      offset,
      opacity,
      fadeHeader,
      headerShown,
      animatedScrollableStatus,
      scrollableOffset,
      pixelScale,
    ],
  );
  return { ...handlers, handleOnScroll };
}

export function SettingsModal({
  visible,
  requestKey = 0,
  onClose,
  onDismiss,
  header,
  step,
  rootStep = 'settings',
  fullHeight = false,
  sizeToContent = false,
  bottomPadding = true,
  keyboardShouldPersistTaps,
  presentation,
  children,
}) {
  const isRoot = step === rootStep || fullHeight;
  const scrollRequest = useMemo(
    () => ({ requestKey, offsets: {} }),
    [requestKey],
  );
  const offsets = scrollRequest.offsets;
  const scrollOffset = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const headerShown = useSharedValue(true);
  const fadeHeader = useSharedValue(isRoot);
  const scrollChrome = useMemo(
    () => ({
      offset: scrollOffset,
      opacity: headerOpacity,
      fadeHeader,
      headerShown,
    }),
    [scrollOffset, headerOpacity, fadeHeader, headerShown],
  );
  const initialOffset = useMemo(
    () => ({ x: 0, y: visible ? offsets[step] ?? 0 : 0 }),
    [step, visible, offsets],
  );

  useLayoutEffect(() => {
    fadeHeader.value = isRoot;
    scrollOffset.value = initialOffset.y;
    headerShown.value = true;
    headerOpacity.value = 1;
  }, [
    step,
    isRoot,
    initialOffset,
    fadeHeader,
    scrollOffset,
    headerOpacity,
    headerShown,
  ]);
  useEffect(() => {
    if (!visible) {
      Object.keys(offsets).forEach(key => delete offsets[key]);
    }
  }, [visible, offsets]);
  const headerStyle = useAnimatedStyle(() => ({
    opacity: isRoot ? headerOpacity.value : 1,
  }));
  const headerContext = useMemo(
    () => ({ header, headerStyle }),
    [header, headerStyle],
  );
  return (
    <HeaderContext.Provider value={headerContext}>
      <ScrollChromeContext.Provider value={scrollChrome}>
        <SheetHost
          visible={visible}
          requestKey={requestKey}
          onClose={onClose}
          onDismiss={onDismiss}
          header={header ? <FloatingHeader /> : undefined}
          headerScrolls={isRoot}
          presentation={
            isRoot ? { ...settingsPresentation, ...presentation } : presentation
          }
          tall={isRoot && !sizeToContent}
          bottomPadding={bottomPadding}
          modalBackdrop
          step={step}
          scrollProps={{
            scrollEventsHandlersHook: useSettingsScrollEvents,
            contentOffset: initialOffset,
            onScroll: event => {
              const { contentOffset, contentSize, layoutMeasurement } =
                event.nativeEvent;
              offsets[step] = Math.min(
                Math.max(0, contentSize.height - layoutMeasurement.height),
                Math.max(0, contentOffset.y),
              );
            },
            keyboardShouldPersistTaps:
              keyboardShouldPersistTaps ??
              (step === 'currency' || step === 'language'
                ? 'handled'
                : 'never'),
          }}
        >
          {children}
        </SheetHost>
      </ScrollChromeContext.Provider>
    </HeaderContext.Provider>
  );
}
const styles = StyleSheet.create({
  header: { height: sheetMetrics.header.height },
});
