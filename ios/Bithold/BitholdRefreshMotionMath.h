#ifndef BitholdRefreshMotionMath_h
#define BitholdRefreshMotionMath_h

#include <CoreGraphics/CoreGraphics.h>
#include <math.h>

typedef struct {
  double speed, thickness, maxRadius, rampStart, rampEnd, distortionStrength;
} BHRefreshFieldConfig;

typedef struct {
  double sampleFactor, sampleMin, sampleMax, translationClamp, shearClamp;
  double scaleXImpact, scaleYImpact, scaleMinX, scaleMaxX, scaleMinY, scaleMaxY;
  double distortionMultiplier, impactMultiplier, translationMultiplier;
  double shearMultiplier, scaleMultiplier;
} BHRefreshTransformConfig;

static inline double BHRefreshClamp(double value, double low, double high) {
  return fmin(fmax(value, low), high);
}

static inline double BHRefreshSmoothstep(double start, double end, double value) {
  if (start == end) return value >= start ? 1 : 0;
  double unit = BHRefreshClamp((value - start) / (end - start), 0, 1);
  return unit * unit * (3 - 2 * unit);
}

static inline double BHRefreshImpact(CGPoint point, CGSize resolution,
                                    CGPoint center, double time,
                                    BHRefreshFieldConfig config) {
  double height = fmax(resolution.height, 1);
  double distance = hypot((point.x - center.x) / height,
                          (point.y - center.y) / height);
  double radius = time * config.speed;
  return BHRefreshSmoothstep(config.rampStart, config.rampEnd, time) *
      BHRefreshSmoothstep(config.thickness, 0, fabs(distance - radius)) *
      (1 - BHRefreshSmoothstep(0, config.maxRadius, radius));
}

static inline CGPoint BHRefreshDisplacement(CGPoint point, CGSize resolution,
                                            CGPoint center, double time,
                                            BHRefreshFieldConfig config) {
  double height = fmax(resolution.height, 1);
  double x = (point.x - center.x) / height;
  double y = (point.y - center.y) / height;
  double distance = hypot(x, y);
  if (distance <= 0.0001) return CGPointZero;
  double impact = BHRefreshImpact(point, resolution, center, time, config);
  return CGPointMake((x / distance) * impact * config.distortionStrength * resolution.width,
                     (y / distance) * impact * config.distortionStrength * resolution.height);
}

static inline CGPoint BHRefreshScaledDisplacement(CGPoint point, CGSize resolution,
                                                  CGPoint center, double time,
                                                  BHRefreshFieldConfig field,
                                                  double multiplier) {
  CGPoint value = BHRefreshDisplacement(point, resolution, center, time, field);
  return CGPointMake(value.x * multiplier, value.y * multiplier);
}

static inline CGAffineTransform BHRefreshTransform(CGRect rect, CGSize resolution,
                                                   CGPoint center, double time,
                                                   BHRefreshFieldConfig field,
                                                   BHRefreshTransformConfig config) {
  CGPoint point = CGPointMake(CGRectGetMidX(rect), CGRectGetMidY(rect));
  double sx = BHRefreshClamp(CGRectGetWidth(rect) * config.sampleFactor,
                             config.sampleMin, config.sampleMax);
  double sy = BHRefreshClamp(CGRectGetHeight(rect) * config.sampleFactor,
                             config.sampleMin, config.sampleMax);
  CGPoint displacement = BHRefreshScaledDisplacement(point, resolution, center, time,
                                                       field, config.distortionMultiplier);
  double impact = BHRefreshImpact(point, resolution, center, time, field) * config.impactMultiplier;
  CGPoint left = BHRefreshScaledDisplacement(CGPointMake(point.x - sx, point.y), resolution,
      center, time, field, config.distortionMultiplier);
  CGPoint right = BHRefreshScaledDisplacement(CGPointMake(point.x + sx, point.y), resolution,
      center, time, field, config.distortionMultiplier);
  CGPoint top = BHRefreshScaledDisplacement(CGPointMake(point.x, point.y - sy), resolution,
      center, time, field, config.distortionMultiplier);
  CGPoint bottom = BHRefreshScaledDisplacement(CGPointMake(point.x, point.y + sy), resolution,
      center, time, field, config.distortionMultiplier);
  double xx = (right.x - left.x) / fmax(2 * sx, 1);
  double yx = (right.y - left.y) / fmax(2 * sx, 1);
  double xy = (bottom.x - top.x) / fmax(2 * sy, 1);
  double yy = (bottom.y - top.y) / fmax(2 * sy, 1);
  return CGAffineTransformMake(
      BHRefreshClamp(1 + xx + impact * config.scaleXImpact * config.scaleMultiplier,
                     config.scaleMinX, config.scaleMaxX),
      BHRefreshClamp(yx * config.shearMultiplier, -config.shearClamp, config.shearClamp),
      BHRefreshClamp(xy * config.shearMultiplier, -config.shearClamp, config.shearClamp),
      BHRefreshClamp(1 + yy + impact * config.scaleYImpact * config.scaleMultiplier,
                     config.scaleMinY, config.scaleMaxY),
      BHRefreshClamp(displacement.x * config.translationMultiplier,
                     -config.translationClamp, config.translationClamp),
      BHRefreshClamp(displacement.y * config.translationMultiplier,
                     -config.translationClamp, config.translationClamp));
}

#endif
