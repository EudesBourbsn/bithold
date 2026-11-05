import { useIsFocused } from '@react-navigation/native';
import {
  Canvas,
  Fill,
  Group,
  Path,
  BlurMask,
  Shader,
  Skia,
} from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import {
  AppState,
  NativeModules,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  makeMutable,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { rayShader } from '../shaders/balanceRayShader';

const source = Skia.RuntimeEffect.Make(rayShader);
const globalClockStart = makeMutable(0);
const globalClock = makeMutable(0);
const globalLastTick = makeMutable(0);

const light = {
  rayColor: [47 / 255, 126 / 255, 195 / 255],
  haloColor: '#3BA5DA',
  falloff: 6.5,
  span: 0.55,
  frameRate: 15,
  reducedFrameRate: 10,
};

export function BalanceGlow({
  scrollOffset,
  sheetOpen = false,
  animated = true,
}) {
  const { width, height } = useWindowDimensions();
  const focused = useIsFocused();
  const reduced = useReducedMotion();
  const active = useSharedValue(false);
  const frameRate = useSharedValue(light.frameRate);
  const time = useSharedValue(0);
  const shaderLastClock = useSharedValue(0);
  const frameIntervalMs = useDerivedValue(() => 1000 / frameRate.value);
  useEffect(() => {
    frameRate.value = sheetOpen ? light.reducedFrameRate : light.frameRate;
  }, [frameRate, sheetOpen]);
  const frameCallback = useFrameCallback(frame => {
    if (!active.value) {
      return;
    }
    const now = frame.timestamp;
    if (!now) {
      return;
    }
    if (globalClockStart.value === 0) {
      globalClockStart.value = now;
      globalClock.value = now;
      globalLastTick.value = now;
      return;
    }
    if (globalLastTick.value === 0) {
      globalLastTick.value = now;
      return;
    }
    const elapsedMs = now - globalLastTick.value;
    if (elapsedMs >= frameIntervalMs.value) {
      const elapsedIntervals = Math.floor(elapsedMs / frameIntervalMs.value);
      const elapsedClockMs = elapsedIntervals * frameIntervalMs.value;
      globalLastTick.value += elapsedClockMs;
      globalClock.value += elapsedClockMs;
    }
  }, false);
  useEffect(() => {
    const updateActive = state => {
      const enabled = animated && focused && !reduced && state === 'active';
      active.value = enabled;
      frameCallback.setActive(enabled);
      if (!animated) {
        globalClockStart.value = 0;
        globalClock.value = 0;
        globalLastTick.value = 0;
      } else if (!enabled) {
        globalLastTick.value = 0;
      }
    };
    updateActive(AppState.currentState);
    const subscription = AppState.addEventListener('change', updateActive);
    return () => subscription.remove();
  }, [active, animated, focused, frameCallback, reduced]);
  useAnimatedReaction(
    () => globalClock.value,
    clock => {
      if (clock === 0 || globalClockStart.value === 0) {
        time.value = 0;
        shaderLastClock.value = 0;
        return;
      }
      if (shaderLastClock.value === 0) {
        time.value = ((clock - globalClockStart.value) / 1000) * 0.2;
        shaderLastClock.value = clock;
        return;
      }
      const deltaMs = clock - shaderLastClock.value;
      shaderLastClock.value = clock;
      if (deltaMs <= 0) {
        return;
      }
      time.value += (deltaMs / 1000) * 0.2;
    },
  );
  const uniforms = useDerivedValue(() => ({
    u_resolution: [width, height],
    u_time: time.value,
    u_color: light.rayColor,
    u_intensity: 14,
    u_falloff: light.falloff,
    u_rayContrast: 1.6,
    u_rayDensity: 2.5,
    u_sweep: 0.25,
    u_pulse: 0,
    u_originX: -0.27,
    u_originY: -0.07,
    u_stretchX: 1.75,
    u_falloffSpan: light.span,
  }));
  const opacity = useDerivedValue(
    () => 1 - Math.min(Math.max(scrollOffset.value / (height / 2), 0), 1) * 0.8,
  );
  const halo = useMemo(() => {
    const radius = NativeModules.BitholdFeedback?.screenCornerRadius ?? 0;
    const inner = Math.max(radius - 5, 0),
      bottom = height / 2 + 50;
    const p = Skia.PathBuilder.Make();
    p.moveTo(0, bottom);
    p.lineTo(0, radius);
    p.quadTo(0, 0, radius, 0);
    p.lineTo(width - radius, 0);
    p.quadTo(width, 0, width, radius);
    p.lineTo(width, bottom);
    p.lineTo(width - 5, 5 + inner);
    p.quadTo(width - 5, 5, width - 5 - inner, 5);
    p.lineTo(5 + inner, 5);
    p.quadTo(5, 5, 5, 5 + inner);
    p.lineTo(0, bottom);
    p.close();
    return p.detach();
  }, [width, height]);
  if (!animated || !source) {
    return null;
  }
  return (
    <View
      pointerEvents="none"
      style={[styles.region, { width, height: height * light.span }]}
    >
      <Canvas
        style={{
          width: Math.ceil(width / 2),
          height: Math.ceil((height * light.span) / 2),
          transform: [{ scale: 2 }],
          transformOrigin: [0, 0, 0],
        }}
      >
        <Group transform={[{ scale: 0.5 }]} opacity={opacity}>
          <Fill>
            <Shader source={source} uniforms={uniforms} />
          </Fill>
          <Group blendMode="plus">
            {[
              [3, 0.3],
              [10, 0.8],
              [20, 1],
              [30, 1],
            ].map(([blur, alpha]) => (
              <Path
                key={blur}
                path={halo}
                color={light.haloColor}
                opacity={alpha}
              >
                <BlurMask blur={blur} style="normal" />
              </Path>
            ))}
          </Group>
        </Group>
      </Canvas>
    </View>
  );
}
const styles = StyleSheet.create({
  region: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});
