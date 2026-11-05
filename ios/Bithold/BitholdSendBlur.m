#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

@interface BitholdSendBlurView : UIView
@property(nonatomic, strong) UIVisualEffectView *material;
@end

@implementation BitholdSendBlurView
- (instancetype)init {
  if ((self = [super init])) {
    self.userInteractionEnabled = NO;
    self.backgroundColor = UIColor.clearColor;
    UIBlurEffect *effect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemUltraThinMaterialDark];
    _material = [[UIVisualEffectView alloc] initWithEffect:effect];
    _material.userInteractionEnabled = NO;
    [self addSubview:_material];
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  self.material.frame = self.bounds;
}
@end

@interface BitholdSendBlur : RCTViewManager
@end

@implementation BitholdSendBlur
RCT_EXPORT_MODULE(BitholdSendBlur)
- (UIView *)view { return [BitholdSendBlurView new]; }
@end
