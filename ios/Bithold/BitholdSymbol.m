#import <React/RCTViewManager.h>
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

@interface BitholdSymbolView : UIImageView
@property(nonatomic, copy) NSString *symbolName;
@property(nonatomic) CGFloat pointSize;
@property(nonatomic, copy) NSString *weight;
@end
@implementation BitholdSymbolView
- (instancetype)init {
  if ((self = [super init])) {
    self.contentMode = UIViewContentModeScaleAspectFit;
    self.tintColor = UIColor.whiteColor;
    _pointSize = 28;
  }
  return self;
}
- (UIImageSymbolWeight)symbolWeight {
  NSDictionary<NSString *, NSNumber *> *weights = @{
    @"light": @(UIImageSymbolWeightLight),
    @"regular": @(UIImageSymbolWeightRegular),
    @"medium": @(UIImageSymbolWeightMedium),
    @"semibold": @(UIImageSymbolWeightSemibold),
    @"bold": @(UIImageSymbolWeightBold),
  };
  NSNumber *weight = _weight ? weights[_weight] : nil;
  return weight ? (UIImageSymbolWeight)weight.integerValue : UIImageSymbolWeightRegular;
}
- (void)updateImage {
  if (!_symbolName) {
    return;
  }
  self.image = [UIImage systemImageNamed:_symbolName withConfiguration:[UIImageSymbolConfiguration configurationWithPointSize:_pointSize weight:[self symbolWeight]]];
}
- (void)setSymbolName:(NSString *)symbolName {
  _symbolName = [symbolName copy];
  [self updateImage];
}
- (void)setPointSize:(CGFloat)pointSize {
  _pointSize = pointSize > 0 ? pointSize : 28;
  [self updateImage];
}
- (void)setWeight:(NSString *)weight {
  _weight = [weight copy];
  [self updateImage];
}
@end
@interface BitholdSymbol : RCTViewManager
@end
@implementation BitholdSymbol
RCT_EXPORT_MODULE(BitholdSymbol)
- (UIView *)view {return [BitholdSymbolView new];}
RCT_EXPORT_VIEW_PROPERTY(symbolName, NSString)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(pointSize, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(weight, NSString)
@end

@interface BitholdSegmentedControlView : UISegmentedControl
@property(nonatomic, copy) NSArray<NSString *> *values;
@property(nonatomic) NSInteger selectedIndex;
@property(nonatomic, copy) RCTBubblingEventBlock onChange;
@end
@implementation BitholdSegmentedControlView
- (instancetype)init {
  if ((self = [super initWithItems:@[]])) {
    [self addTarget:self action:@selector(changed) forControlEvents:UIControlEventValueChanged];
  }
  return self;
}
- (void)setValues:(NSArray<NSString *> *)values {
  _values = [values copy];
  [self removeAllSegments];
  [_values enumerateObjectsUsingBlock:^(NSString *title, NSUInteger index, BOOL *stop) {
    [self insertSegmentWithTitle:title atIndex:index animated:NO];
  }];
  [self applySelection];
}
- (void)setSelectedIndex:(NSInteger)selectedIndex {
  _selectedIndex = selectedIndex;
  [self applySelection];
}
- (void)applySelection {
  if (_selectedIndex >= 0 && _selectedIndex < (NSInteger)self.numberOfSegments) {
    self.selectedSegmentIndex = _selectedIndex;
  }
}
- (void)changed {
  _selectedIndex = self.selectedSegmentIndex;
  if (self.onChange) {
    self.onChange(@{@"selectedIndex": @(self.selectedSegmentIndex)});
  }
}
@end
@interface BitholdSegmentedControl : RCTViewManager
@end
@implementation BitholdSegmentedControl
RCT_EXPORT_MODULE(BitholdSegmentedControl)
- (UIView *)view {return [BitholdSegmentedControlView new];}
RCT_EXPORT_VIEW_PROPERTY(values, NSArray)
RCT_EXPORT_VIEW_PROPERTY(selectedIndex, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
@end
