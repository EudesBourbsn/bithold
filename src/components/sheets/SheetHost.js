import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  Modal,
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  useAnimatedRef,
  measure,
  makeMutable,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useT } from '../../i18n/index';
import { colors } from '../../theme/index';
import { BubbleHost } from '../feedback/AddressBubble';
import { SheetGestureLifecycleContext } from './SheetGestureLifecycleContext';
import { SheetHandle } from './SheetHandle';
import { sheetSpring } from './sheetMotion';
import {
  InlineSheetPresentation,
  SheetPresentationContext,
} from './SheetPresentation';
import { SheetPresentationLifecycle } from './SheetPresentationLifecycle';
import { SheetReadinessObserver } from './SheetReadinessObserver';
import { useSheetHostGestures } from './useSheetHostGestures';

const snapPoints = ['100%'];
const layoutTransition = LinearTransition.easing(Easing.elastic(0.8));
function EmptyBackground() {
  return null;
}

export function SheetHost({
  visible,
  requestKey = 0,
  onClose,
  onDismiss,
  header,
  headerScrolls = false,
  background,
  children,
  footer,
  step = 'initial',
  tall = false,
  maxFraction = 1,
  dismissOnBackdrop = true,
  showHandle = true,
  cornerRadius = 35,
  bottomPadding = true,
  dismissRequested = false,
  dismissSpring,
  scrollProps = {},
  presentation: presentationOptions,
  modalBackdrop = true,
}) {
  const t = useT();
  const presentationMode = useContext(SheetPresentationContext);
  const inline = Platform.OS === 'ios' && presentationMode === 'inline';
  const Presentation = inline ? InlineSheetPresentation : Modal;
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const containerTopInset =
    presentationOptions?.containerTopInset ?? insets.top;

  const containerLayoutState = useMemo(
    () =>
      makeMutable({
        height: Math.max(0, height - containerTopInset),
        offset: { top: containerTopInset, bottom: 0, left: 0, right: 0 },
      }),
    [height, containerTopInset],
  );
  const animationConfigs = presentationOptions?.animationConfigs ?? sheetSpring;
  const gestureEventsHandlersHook =
    presentationOptions?.gestureEventsHandlersHook ?? useSheetHostGestures;
  const dragThresholdHeight = presentationOptions?.dragThresholdHeight;

  const bottomRadius =
    presentationOptions?.bottomCornerRadius ??
    (NativeModules.BitholdFeedback?.screenCornerRadius || 30);

  const sheet = useRef(null);

  const [presentation, setPresentation] = useState({
    modalVisible: false,
    mounted: false,
    generation: 0,
  });
  const presented = presentation.mounted;
  const generation = presentation.generation;
  const [keyboard, setKeyboard] = useState(0);
  const animatedIndex = useSharedValue(-1);
  const animatedPosition = useSharedValue(height);
  const surfaceRef = useAnimatedRef();
  const isClosing = useSharedValue(false);
  const committedClosing = useSharedValue(false);
  const hitTestEnabled = useSharedValue(false);
  const latest = useRef(null);
  latest.current = {
    onClose,
    onDismiss,
    animationConfigs,
    dismissSpring: dismissSpring ?? presentationOptions?.animationConfigs,
  };
  const lifecycle = useRef(null);
  if (!lifecycle.current) {
    lifecycle.current = new SheetPresentationLifecycle({
      update: state => {
        hitTestEnabled.value = state.modalVisible;

        setPresentation(state);
      },
      closing: (value, origin) => {
        committedClosing.value = value && origin !== 'gesture';
        isClosing.value = value;

        if (committedClosing.value) {
          hitTestEnabled.value = false;
        }
      },
      openSheet: () => {
        sheet.current?.snapToIndex(0, latest.current.animationConfigs);
      },
      closeSheet: () => {
        Keyboard.dismiss();
        sheet.current?.forceClose(latest.current.dismissSpring);
      },
      onClose: key => latest.current.onClose?.(key),
      onDismiss: () => latest.current.onDismiss?.(),
    });
  }
  const dismiss = useCallback(() => {
    lifecycle.current.dismiss();
  }, []);
  const finishSheet = useCallback(id => {
    lifecycle.current.sheetHidden(id);
  }, []);
  const sheetReady = useCallback(
    () => lifecycle.current.sheetReady(generation),
    [generation],
  );
  const nativeShown = useCallback(
    () => lifecycle.current.nativeShown(generation),
    [generation],
  );
  const nativeDismissed = useCallback(
    () => lifecycle.current.nativeDismissed(generation),
    [generation],
  );
  const catchClosingGesture = useCallback(
    () => lifecycle.current.animationOpening(generation),
    [generation],
  );
  const gestureLifecycle = useMemo(
    () => ({
      isClosing,
      committedClosing,
      catchClosingGesture,
      dragThresholdHeight,
    }),
    [isClosing, committedClosing, catchClosingGesture, dragThresholdHeight],
  );
  useEffect(() => {
    const controller = lifecycle.current;
    controller.attach();
    return () => controller.dispose();
  }, []);
  useEffect(() => {
    lifecycle.current.setVisible(visible, requestKey);
  }, [visible, requestKey]);
  useEffect(() => {
    if (visible && dismissRequested) {
      dismiss();
    }
  }, [visible, dismissRequested, dismiss]);
  useEffect(() => {
    if (!presented) {
      setKeyboard(0);
      return;
    }
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow',
      event => {
        setKeyboard(Math.max(0, height - event.endCoordinates.screenY));
      },
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboard(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, [presented, height]);

  const backdropOpacity =
    presentationOptions?.backdropOpacity ?? (modalBackdrop ? 0.9 : 0.83);
  const backdrop = useAnimatedStyle(() => ({
    opacity:
      backdropOpacity * Math.max(0, Math.min(1, animatedIndex.value + 1)),
  }));
  const interactionStyle = useAnimatedStyle(() => ({
    pointerEvents: hitTestEnabled.value ? 'auto' : 'none',
  }));
  const surfaceBottomInset = presentationOptions?.surfaceBottomInset ?? 0;

  const radii = {
    borderTopLeftRadius: cornerRadius,
    borderTopRightRadius: cornerRadius,
    borderBottomLeftRadius: bottomRadius,
    borderBottomRightRadius: bottomRadius,
  };

  useAnimatedReaction(
    () => ({ closing: isClosing.value, position: animatedPosition.value }),
    current => {
      if (!current.closing) {
        return;
      }
      const frame = measure(surfaceRef);
      if (frame && frame.pageY >= height) {
        hitTestEnabled.value = false;
        isClosing.value = false;
        runOnJS(finishSheet)(generation, 'visual-exit');
      }
    },
    [generation, height, finishSheet],
  );
  useEffect(() => {
    if (
      !inline &&
      Platform.OS !== 'ios' &&
      presented &&
      !presentation.modalVisible
    ) {
      lifecycle.current.nativeDismissed(generation);
    }
  }, [inline, presented, presentation.modalVisible, generation]);
  const maximumHeight = Math.max(
    0,
    Math.min(height - insets.top - surfaceBottomInset, height * maxFraction),
  );
  const padding = bottomPadding
    ? keyboard ||
      Math.max(insets.bottom, presentationOptions?.minimumBottomInset ?? 0)
    : 0;
  const {
    contentContainerStyle,
    style: scrollStyle,
    ...scrollOptions
  } = scrollProps;
  return (
    <SheetPresentationContext.Provider value="native">
      <Presentation
        key={generation}
        visible={presentation.modalVisible}
        interactionStyle={inline ? interactionStyle : undefined}
        transparent
        animationType="none"
        presentationStyle="overFullScreen"
        onShow={nativeShown}
        onDismiss={nativeDismissed}
        onRequestClose={dismiss}
        statusBarTranslucent
      >
        <GestureHandlerRootView style={styles.root}>
          <BubbleHost>
            <View
              style={styles.root}
              accessibilityViewIsModal
              onAccessibilityEscape={dismiss}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={dismissOnBackdrop ? dismiss : undefined}
                accessibilityRole="button"
                accessibilityLabel={
                  dismissOnBackdrop ? t('sheet.dismiss') : t('sheet.background')
                }
              >
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.backdrop,
                    modalBackdrop && styles.modalBackdrop,
                    presentationOptions?.backdropColor && {
                      backgroundColor: presentationOptions.backdropColor,
                    },
                    backdrop,
                  ]}
                />
              </Pressable>
              {presented && (
                <SheetGestureLifecycleContext.Provider value={gestureLifecycle}>
                  <BottomSheet
                    ref={sheet}
                    containerLayoutState={containerLayoutState}
                    index={-1}
                    animateOnMount={false}
                    snapPoints={snapPoints}
                    detached
                    enableDynamicSizing={false}
                    enablePanDownToClose
                    animationConfigs={animationConfigs}
                    gestureEventsHandlersHook={gestureEventsHandlersHook}
                    backgroundComponent={EmptyBackground}
                    handleComponent={null}
                    animatedIndex={animatedIndex}
                    animatedPosition={animatedPosition}
                    containerStyle={styles.container}
                    topInset={containerTopInset}
                    keyboardBehavior={
                      presentationOptions?.keyboardBehavior ?? 'extend'
                    }
                    keyboardBlurBehavior={
                      presentationOptions?.keyboardBlurBehavior ?? 'restore'
                    }
                    enableBlurKeyboardOnGesture={
                      presentationOptions?.enableBlurKeyboardOnGesture ?? true
                    }
                    onChange={index => {
                      if (index >= 0) {
                        lifecycle.current.sheetOpened(generation);
                      }
                    }}
                    onAnimate={(_from, to) => {
                      if (to === -1) {
                        lifecycle.current.animationClosing(generation);
                      } else if (to >= 0) {
                        lifecycle.current.animationOpening(generation);
                      }
                    }}
                    onClose={() => finishSheet(generation)}
                    accessible={false}
                  >
                    <SheetReadinessObserver onReady={sheetReady} />
                    <Pressable
                      style={StyleSheet.absoluteFill}
                      onPress={dismissOnBackdrop ? dismiss : undefined}
                      accessible={false}
                    />
                    <Animated.View
                      ref={surfaceRef}
                      layout={layoutTransition}
                      collapsable={false}
                      style={[
                        styles.position,
                        {
                          bottom: surfaceBottomInset,
                        },
                        presentationOptions?.horizontalInset != null && {
                          left: presentationOptions.horizontalInset,
                          right: presentationOptions.horizontalInset,
                        },
                        radii,
                      ]}
                    >
                      <View
                        style={[
                          styles.frame,
                          presentationOptions?.frameColor && {
                            backgroundColor: presentationOptions.frameColor,
                          },
                          radii,
                        ]}
                      >
                        {background && (
                          <View
                            pointerEvents="none"
                            style={StyleSheet.absoluteFill}
                          >
                            {background}
                          </View>
                        )}
                        <View
                          style={[
                            styles.content,
                            {
                              maxHeight: maximumHeight,
                              height: tall ? maximumHeight : undefined,
                            },
                            header && !headerScrolls
                              ? styles.contentWithHeader
                              : styles.contentWithoutHeader,
                          ]}
                        >
                          <BottomSheetScrollView
                            key={step}
                            style={[styles.scroll, scrollStyle]}
                            alwaysBounceVertical={false}
                            bounces
                            directionalLockEnabled
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            accessible={false}
                            contentInsetAdjustmentBehavior="never"
                            {...scrollOptions}
                            contentContainerStyle={[
                              footer
                                ? styles.noBottomPadding
                                : { paddingBottom: padding },
                              header && headerScrolls && styles.scrollingHeader,
                              contentContainerStyle,
                            ]}
                          >
                            {children}
                          </BottomSheetScrollView>
                          {footer && (
                            <View
                              style={[
                                styles.footer,
                                keyboard
                                  ? styles.noBottomPadding
                                  : { paddingBottom: insets.bottom },
                              ]}
                            >
                              {footer}
                            </View>
                          )}
                        </View>
                        {header && <View style={styles.header}>{header}</View>}
                        {showHandle && <SheetHandle />}
                      </View>
                      {presentationOptions?.border !== false && (
                        <View
                          pointerEvents="none"
                          style={[styles.border, radii]}
                        />
                      )}
                    </Animated.View>
                  </BottomSheet>
                </SheetGestureLifecycleContext.Provider>
              )}
            </View>
          </BubbleHost>
        </GestureHandlerRootView>
      </Presentation>
    </SheetPresentationContext.Provider>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { marginHorizontal: 0 },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.modalBackdrop,
  },
  modalBackdrop: { backgroundColor: colors.modalBackdrop },
  position: { position: 'absolute', left: 0, right: 0, overflow: 'hidden' },
  frame: { backgroundColor: colors.modal, overflow: 'hidden' },
  content: { overflow: 'hidden' },
  contentWithHeader: { paddingTop: 64 },
  contentWithoutHeader: { paddingTop: 0 },
  noBottomPadding: { paddingBottom: 0 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, height: 64 },
  scroll: { flexShrink: 1 },
  scrollingHeader: { flexGrow: 1, paddingTop: 64 },
  footer: { flexShrink: 0 },
  border: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: colors.sheetOutline,
  },
});
