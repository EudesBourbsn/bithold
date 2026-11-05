#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "BitholdRefreshMotionMath.h"

@class BitholdRefreshMotion;

@interface BHRefreshDisplayLinkTarget : NSObject
@property (nonatomic, weak) BitholdRefreshMotion *owner;
- (void)tick:(CADisplayLink *)link;
@end

@interface BitholdRefreshMotion : NSObject <RCTBridgeModule>
@property (nonatomic, weak) UIView *rootView;
@property (nonatomic, strong) NSMutableArray<UIView *> *morphViews;
@property (nonatomic, strong) CADisplayLink *displayLink;
@property (nonatomic, copy) RCTPromiseResolveBlock completion;
@property (nonatomic) CFTimeInterval startTime;
@property (nonatomic) CFTimeInterval duration;
@property (nonatomic) double maxTime;
@property (nonatomic) CGPoint center;
@property (nonatomic) BHRefreshFieldConfig fieldConfig;
@property (nonatomic) BHRefreshTransformConfig transformConfig;
@property (nonatomic, strong) NSMapTable<UIView *, NSDictionary *> *viewGroups;
@property (nonatomic) BOOL invalidated;
- (void)tick:(CADisplayLink *)link;
- (void)complete:(BOOL)finished reason:(NSString *)reason;
@end

@implementation BHRefreshDisplayLinkTarget
- (void)tick:(CADisplayLink *)link {
  BitholdRefreshMotion *owner = self.owner;
  if (owner) [owner tick:link];
  else [link invalidate];
}
@end

static NSDictionary *BHRefreshDictionary(id value) {
  return [value isKindOfClass:NSDictionary.class] ? value : @{};
}

static double BHRefreshNumber(NSDictionary *values, NSString *key, double fallback) {
  id value = values[key];
  if (![value isKindOfClass:NSNumber.class]) return fallback;
  double number = [value doubleValue];
  return isfinite(number) ? number : fallback;
}

static BHRefreshTransformConfig BHRefreshGroup(BHRefreshTransformConfig config, NSDictionary *group) {
#define BH_GROUP(member) config.member = BHRefreshNumber(group, @#member, config.member)
  BH_GROUP(sampleFactor); BH_GROUP(sampleMin); BH_GROUP(sampleMax);
  BH_GROUP(distortionMultiplier); BH_GROUP(impactMultiplier);
  BH_GROUP(translationMultiplier); BH_GROUP(shearMultiplier); BH_GROUP(scaleMultiplier);
#undef BH_GROUP
  config.sampleMin = fmax(0, config.sampleMin);
  config.sampleMax = fmax(config.sampleMin, config.sampleMax);
  return config;
}

static NSNumber *BHRefreshTag(id value) {
  if (![value isKindOfClass:NSNumber.class]) return nil;
  double tag = [value doubleValue];
  return isfinite(tag) && tag > 0 && floor(tag) == tag ? value : nil;
}

@implementation BitholdRefreshMotion
RCT_EXPORT_MODULE(BitholdRefreshMotion)
@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

+ (BOOL)requiresMainQueueSetup { return YES; }
- (dispatch_queue_t)methodQueue { return dispatch_get_main_queue(); }

- (instancetype)init {
  if ((self = [super init])) {
    _morphViews = [NSMutableArray array];
    _viewGroups = [NSMapTable weakToStrongObjectsMapTable];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationInactive:)
        name:UIApplicationWillResignActiveNotification object:nil];
  }
  return self;
}

- (void)applicationInactive:(NSNotification *)notification {
  [self complete:NO reason:@"inactive"];
}

RCT_EXPORT_METHOD(start:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [self complete:NO reason:@"replaced"];
  if (self.invalidated) {
    resolve(@{@"finished": @NO, @"reason": @"invalidated"});
    return;
  }
  options = BHRefreshDictionary(options);
  NSNumber *rootTag = BHRefreshTag(options[@"rootTag"]);
  if (!rootTag) {
    reject(@"invalid_root", @"A mounted refresh root is required.", nil);
    return;
  }
  if (UIApplication.sharedApplication.applicationState != UIApplicationStateActive) {
    resolve(@{@"finished": @NO, @"reason": @"inactive"});
    return;
  }
  UIView *root = [self.viewRegistry_DEPRECATED viewForReactTag:rootTag];
  UIWindow *window = root.window;
  if (!window || window.hidden || window.alpha <= 0 || !window.windowScene ||
      window.windowScene.activationState != UISceneActivationStateForegroundActive ||
      root.hidden || root.alpha <= 0.001 ||
      !isfinite(root.bounds.size.width) || !isfinite(root.bounds.size.height) ||
      root.bounds.size.width <= 0 || root.bounds.size.height <= 0) {
    resolve(@{@"finished": @NO, @"reason": @"missing_root"});
    return;
  }
  NSDictionary *groups = BHRefreshDictionary(options[@"groupConfigs"]);
  NSArray *targets = [options[@"targets"] isKindOfClass:NSArray.class] ? options[@"targets"] : @[];
  for (id entry in targets) {
    NSDictionary *target = BHRefreshDictionary(entry);
    NSNumber *tag = BHRefreshTag(target[@"tag"]);
    if (!tag) continue;
    UIView *view = [self.viewRegistry_DEPRECATED viewForReactTag:tag];
    if (!view || view == root || view.window != window || ![view isDescendantOfView:root] ||
        [self.morphViews containsObject:view]) continue;
    NSString *groupName = [target[@"group"] isKindOfClass:NSString.class] ? target[@"group"] : nil;
    NSDictionary *group = groupName ? BHRefreshDictionary(groups[groupName]) : @{};
    [self.morphViews addObject:view];
    [self.viewGroups setObject:group forKey:view];
  }
  if (self.morphViews.count == 0) {
    resolve(@{@"finished": @NO, @"reason": @"missing_controls"});
    return;
  }
  NSDictionary *field = BHRefreshDictionary(options[@"fieldConfig"]);
  self.fieldConfig = (BHRefreshFieldConfig){
    BHRefreshNumber(field, @"speed", 0.5), BHRefreshNumber(field, @"thickness", 0.2),
    BHRefreshNumber(field, @"maxRadius", 1.25), BHRefreshNumber(field, @"rampStart", 0.15),
    BHRefreshNumber(field, @"rampEnd", 0.7), BHRefreshNumber(field, @"distortionStrength", 0.02)
  };
  NSDictionary *transform = BHRefreshDictionary(options[@"transformConfig"]);
  BHRefreshTransformConfig config = {0.25, 12, 48, 20, 0.045, 0.006, 0.003,
      0.94, 1.06, 0.96, 1.04, 1, 1, 1, 1, 1};
#define BH_TRANSFORM(member) config.member = BHRefreshNumber(transform, @#member, config.member)
  BH_TRANSFORM(sampleFactor); BH_TRANSFORM(sampleMin); BH_TRANSFORM(sampleMax);
  BH_TRANSFORM(translationClamp); BH_TRANSFORM(shearClamp);
  BH_TRANSFORM(scaleXImpact); BH_TRANSFORM(scaleYImpact);
  BH_TRANSFORM(scaleMinX); BH_TRANSFORM(scaleMaxX); BH_TRANSFORM(scaleMinY); BH_TRANSFORM(scaleMaxY);
#undef BH_TRANSFORM
  config.translationClamp = fabs(config.translationClamp);
  config.shearClamp = fabs(config.shearClamp);
  config.scaleMaxX = fmax(config.scaleMinX, config.scaleMaxX);
  config.scaleMaxY = fmax(config.scaleMinY, config.scaleMaxY);
  config.sampleMin = fmax(0, config.sampleMin);
  config.sampleMax = fmax(config.sampleMin, config.sampleMax);
  self.transformConfig = config;
  self.rootView = root;
  self.center = CGPointMake(BHRefreshNumber(options, @"centerX", CGRectGetMidX(root.bounds)),
                            BHRefreshNumber(options, @"centerY", CGRectGetMidY(root.bounds)));
  self.duration = fmax(BHRefreshNumber(options, @"duration", 1650) / 1000.0, 0.01);
  self.maxTime = BHRefreshNumber(options, @"maxTime", 2.5);
  self.completion = resolve;
  self.startTime = CACurrentMediaTime();
  BHRefreshDisplayLinkTarget *target = [BHRefreshDisplayLinkTarget new];
  target.owner = self;
  self.displayLink = [CADisplayLink displayLinkWithTarget:target selector:@selector(tick:)];
  [self.displayLink addToRunLoop:NSRunLoop.mainRunLoop forMode:NSRunLoopCommonModes];
}

- (void)tick:(CADisplayLink *)link {
  if (link != self.displayLink) return;
  UIView *root = self.rootView;
  if (!root.window || UIApplication.sharedApplication.applicationState != UIApplicationStateActive) {
    [self complete:NO reason:@"detached"];
    return;
  }
  CGSize resolution = root.bounds.size;
  if (!isfinite(resolution.width) || !isfinite(resolution.height) || resolution.width <= 0 || resolution.height <= 0) {
    [self complete:NO reason:@"invalid_layout"];
    return;
  }
  double progress = BHRefreshClamp((link.timestamp - self.startTime) / self.duration, 0, 1);
  double time = progress * self.maxTime;
  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  for (UIView *view in self.morphViews) {
    if (!view.window || ![view isDescendantOfView:root] || view.hidden || view.alpha <= 0.001) continue;
    CGRect rect = [view convertRect:view.bounds toView:root];
    if (!isfinite(rect.origin.x) || !isfinite(rect.origin.y) ||
        !isfinite(rect.size.width) || !isfinite(rect.size.height) ||
        rect.size.width <= 0 || rect.size.height <= 0) continue;
    NSDictionary *group = [self.viewGroups objectForKey:view];
    CGAffineTransform value = CGAffineTransformIdentity;
    if (![group[@"enabled"] respondsToSelector:@selector(boolValue)] || [group[@"enabled"] boolValue]) {
      value = BHRefreshTransform(rect, resolution, self.center, time, self.fieldConfig,
                                  BHRefreshGroup(self.transformConfig, group));
    }
    if (!isfinite(value.a) || !isfinite(value.b) || !isfinite(value.c) ||
        !isfinite(value.d) || !isfinite(value.tx) || !isfinite(value.ty)) value = CGAffineTransformIdentity;
    view.transform = value;
  }
  [CATransaction commit];
  if (progress >= 1) [self complete:YES reason:@"finished"];
}

RCT_EXPORT_METHOD(cancel) {
  [self complete:NO reason:@"cancelled"];
}

- (void)complete:(BOOL)finished reason:(NSString *)reason {
  [self.displayLink invalidate];
  self.displayLink = nil;
  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  for (UIView *view in self.morphViews) {
    view.transform = CGAffineTransformIdentity;
    view.layer.transform = CATransform3DIdentity;
  }
  [CATransaction commit];
  [self.morphViews removeAllObjects];
  self.rootView = nil;
  [self.viewGroups removeAllObjects];
  RCTPromiseResolveBlock completion = self.completion;
  self.completion = nil;
  if (completion) completion(@{@"finished": @(finished), @"reason": reason});
}

- (void)invalidate {
  if (NSThread.isMainThread) {
    self.invalidated = YES;
    [self complete:NO reason:@"invalidated"];
  } else {
    dispatch_async(dispatch_get_main_queue(), ^{ [self invalidate]; });
  }
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [_displayLink invalidate];
}
@end
