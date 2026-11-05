import { defineAnimation, ReduceMotion } from 'react-native-reanimated';

export function withReceiveSheetSpring(target, config, callback) {
  'worklet';
  return defineAnimation(target, () => {
    'worklet';
    const decay = config.damping / (2 * config.mass);
    const frequencySquared = config.stiffness / config.mass;
    const oscillation = Math.sqrt(frequencySquared - decay * decay);
    const releasedVelocity = config.velocity ?? 0;
    return {
      current: target,
      toValue: target,
      velocity: releasedVelocity,
      lastTimestamp: 0,
      startTimestamp: 0,
      callback,
      reduceMotion:
        config.reduceMotion === ReduceMotion.Always
          ? true
          : config.reduceMotion === ReduceMotion.Never
          ? false
          : undefined,
      onStart(animation, value, timestamp, previous) {
        animation.current = value;
        const continuing =
          previous?.lastTimestamp > 0 &&
          previous?.startTimestamp > 0 &&
          previous?.toValue === target;
        const previousVelocity = previous?.velocity ?? 0;
        animation.velocity = continuing
          ? previousVelocity
          : previousVelocity + releasedVelocity;
        animation.lastTimestamp = previous?.lastTimestamp || timestamp;
        animation.startTimestamp = continuing
          ? previous.startTimestamp
          : timestamp;
      },
      onFrame(animation, timestamp) {
        const seconds =
          Math.min(64, Math.max(0, timestamp - animation.lastTimestamp)) / 1000;
        animation.lastTimestamp = timestamp;
        const displacement = animation.current - target;
        const velocity = animation.velocity;
        const phase = oscillation * seconds;
        const attenuation = Math.exp(-decay * seconds);
        const sine = Math.sin(phase);
        const cosine = Math.cos(phase);
        animation.current =
          target +
          attenuation *
            (displacement * cosine +
              ((velocity + decay * displacement) / oscillation) * sine);
        animation.velocity =
          attenuation *
          (velocity * cosine -
            ((decay * velocity + frequencySquared * displacement) /
              oscillation) *
              sine);
        const settled =
          Math.abs(animation.current - target) <
            config.restDisplacementThreshold &&
          Math.abs(animation.velocity) < config.restSpeedThreshold;
        if (settled) {
          animation.current = target;
          animation.velocity = 0;
          animation.lastTimestamp = 0;
        }
        return settled;
      },
    };
  });
}
