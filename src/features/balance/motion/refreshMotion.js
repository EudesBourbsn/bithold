export const refreshMotion = {
  threshold: 50,
  duration: 1650,
  end: 2.5,
  speed: 0.5,
  thickness: 0.2,
  maxRadius: 1.25,
  rampStart: 0.15,
  rampEnd: 0.7,
  rippleAlpha: 0.15,
  distortionStrength: 0.02,
  sampleFactor: 0.25,
  sampleMin: 12,
  sampleMax: 48,
  translationClamp: 20,
  shearClamp: 0.045,
  scaleXImpact: 0.006,
  scaleYImpact: 0.003,
  scaleMinX: 0.94,
  scaleMaxX: 1.06,
  scaleMinY: 0.96,
  scaleMaxY: 1.04,
  translationMultiplier: 0.85,
  scaleMultiplier: 0.75,
};

export function rippleOrigin(width, height, tablet = false) {
  'worklet';
  const collapsedHeight = tablet
    ? 450
    : height < 736
    ? 250
    : height < 798
    ? 300
    : 342;
  return {
    origin: [width / 2, (height - collapsedHeight) / 2],
    extent: height,
  };
}

export function nativeRefreshOptions(width, height, tablet, rootTag, targets) {
  const { origin } = rippleOrigin(width, height, tablet);
  return {
    rootTag,
    targets,
    centerX: origin[0],
    centerY: origin[1],
    duration: refreshMotion.duration,
    maxTime: refreshMotion.end,
    fieldConfig: {
      speed: refreshMotion.speed,
      thickness: refreshMotion.thickness,
      maxRadius: refreshMotion.maxRadius,
      rampStart: refreshMotion.rampStart,
      rampEnd: refreshMotion.rampEnd,
      distortionStrength: refreshMotion.distortionStrength,
    },
    transformConfig: {
      sampleFactor: refreshMotion.sampleFactor,
      sampleMin: refreshMotion.sampleMin,
      sampleMax: refreshMotion.sampleMax,
      translationClamp: refreshMotion.translationClamp,
      shearClamp: refreshMotion.shearClamp,
      scaleXImpact: refreshMotion.scaleXImpact,
      scaleYImpact: refreshMotion.scaleYImpact,
      scaleMinX: refreshMotion.scaleMinX,
      scaleMaxX: refreshMotion.scaleMaxX,
      scaleMinY: refreshMotion.scaleMinY,
      scaleMaxY: refreshMotion.scaleMaxY,
    },
    groupConfigs: {
      controls: {
        translationMultiplier: refreshMotion.translationMultiplier,
        scaleMultiplier: refreshMotion.scaleMultiplier,
      },
      actions: {
        translationMultiplier: 0.95,
        scaleMultiplier: 0.8,
      },
    },
  };
}
