import { animate as defaultAnimate } from '@gorhom/bottom-sheet/src/utilities/animate';
import { withReceiveSheetSpring } from './withReceiveSheetSpring';

export function animate(parameters) {
  'worklet';
  const {
    point,
    configs,
    velocity = 0,
    overrideReduceMotion,
    onComplete,
  } = parameters;
  if (
    configs?.bitholdMotion !== 'receive' ||
    'duration' in configs ||
    'easing' in configs
  ) {
    return defaultAnimate(parameters);
  }
  return withReceiveSheetSpring(
    point,
    {
      ...configs,
      velocity: configs.velocity ?? velocity,
      reduceMotion: overrideReduceMotion ?? configs.reduceMotion,
    },
    onComplete,
  );
}
