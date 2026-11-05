import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, findNodeHandle, NativeModules, Platform } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { impactFeedback } from '../../../services/feedback';
import { nativeRefreshOptions, refreshMotion } from '../motion/refreshMotion';

export function useBalanceRefresh({
  enabled,
  animationEnabled = true,
  scrollOffset,
  viewport,
  onRefresh,
}) {
  const startedAtTop = useSharedValue(false);
  const armed = useSharedValue(false);
  const running = useSharedValue(false);
  const animating = useSharedValue(false);
  const revision = useSharedValue(0);
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const motionEnabled = animationEnabled && !reducedMotion;
  const motionEnabledRef = useRef(motionEnabled);
  motionEnabledRef.current = motionEnabled;
  const motionRevision = useRef(0);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const available = enabled && active;
  const availableRef = useRef(available);
  availableRef.current = available;
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;
  const mounted = useRef(true);
  const rootRef = useRef(null);
  const activityRef = useRef(null);
  const settingsRef = useRef(null);
  const receiveRef = useRef(null);
  const sendRef = useRef(null);

  const stopMotion = useCallback(() => {
    motionRevision.current += 1;
    cancelAnimation(progress);
    progress.value = 0;
    animating.value = false;
    NativeModules.BitholdRefreshMotion?.cancel();
  }, [progress, animating]);
  const cancelMotion = useCallback(() => {
    revision.value += 1;
    startedAtTop.value = false;
    armed.value = false;
    stopMotion();
  }, [revision, startedAtTop, armed, stopMotion]);

  useEffect(() => {
    if (!motionEnabled) {
      stopMotion();
    }
  }, [motionEnabled, stopMotion]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      availableRef.current = enabled && state === 'active';
      if (state !== 'active') {
        cancelMotion();
      }
      setActive(state === 'active');
    });
    return () => subscription.remove();
  }, [enabled, cancelMotion]);

  useEffect(() => {
    if (!available) {
      cancelMotion();
    }
  }, [available, cancelMotion]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cancelMotion();
    };
  }, [cancelMotion]);

  const triggerHaptic = useCallback(
    requestRevision => {
      if (
        mounted.current &&
        availableRef.current &&
        revision.value === requestRevision
      ) {
        impactFeedback();
      }
    },
    [revision],
  );

  const performRefresh = useCallback(
    async requestRevision => {
      try {
        if (
          mounted.current &&
          availableRef.current &&
          revision.value === requestRevision
        ) {
          await refreshRef.current();
        }
      } finally {
        running.value = false;
      }
    },
    [revision, running],
  );

  const startMotion = useCallback(
    async requestRevision => {
      if (
        !mounted.current ||
        !availableRef.current ||
        revision.value !== requestRevision
      ) {
        return;
      }
      if (!motionEnabledRef.current) {
        animating.value = false;
        return;
      }
      const motion = NativeModules.BitholdRefreshMotion;
      const { width, height } = viewportRef.current;
      if (!motion || width <= 0 || height <= 0) {
        animating.value = false;
        return;
      }
      const currentMotion = ++motionRevision.current;
      progress.value = 0;
      try {
        const rootTag = findNodeHandle(rootRef.current);
        const targets = [
          [activityRef, 'controls'],
          [settingsRef, 'controls'],
          [receiveRef, 'actions'],
          [sendRef, 'actions'],
        ]
          .map(([ref, group]) => ({ tag: findNodeHandle(ref.current), group }))
          .filter(({ tag }) => Number.isInteger(tag) && tag > 0);
        if (!Number.isInteger(rootTag) || rootTag <= 0 || targets.length === 0) {
          return;
        }
        const completion = motion.start(
          nativeRefreshOptions(width, height, Platform.isPad, rootTag, targets),
        );
        progress.value = withTiming(refreshMotion.end, {
          duration: refreshMotion.duration,
          easing: Easing.bezier(0.42, 0, 1, 1),
        });
        await completion;
      } catch {
        // Motion failure must not interrupt the refresh.
      } finally {
        if (
          mounted.current &&
          revision.value === requestRevision &&
          motionRevision.current === currentMotion
        ) {
          cancelAnimation(progress);
          progress.value = 0;
          animating.value = false;
        }
      }
    },
    [revision, animating, progress],
  );

  const onScroll = useAnimatedScrollHandler(
    {
      onBeginDrag: event => {
        startedAtTop.value = available && event.contentOffset.y <= 0;
        armed.value = false;
      },
      onScroll: event => {
        const offset = event.contentOffset.y;
        scrollOffset.value = offset;
        if (
          available &&
          startedAtTop.value &&
          !running.value &&
          !animating.value &&
          !armed.value &&
          offset < -refreshMotion.threshold
        ) {
          armed.value = true;
          scheduleOnRN(triggerHaptic, revision.value);
        }
      },
      onEndDrag: () => {
        const trigger =
          available && armed.value && !running.value && !animating.value;
        startedAtTop.value = false;
        armed.value = false;
        if (!trigger) {
          return;
        }
        running.value = true;
        scheduleOnRN(performRefresh, revision.value);
        if (!motionEnabled) {
          return;
        }
        animating.value = true;
        scheduleOnRN(startMotion, revision.value);
      },
    },
    [available, motionEnabled, performRefresh, triggerHaptic, startMotion],
  );

  return {
    onScroll,
    progress,
    running,
    armed,
    motionEnabled,
    motionRefs: {
      root: rootRef,
      activity: activityRef,
      settings: settingsRef,
      receive: receiveRef,
      send: sendRef,
    },
  };
}
