#import <React/RCTViewManager.h>
#import <React/RCTComponent.h>
#import <React/UIView+React.h>
#import <UIKit/UIKit.h>

// Adapted from react-native-context-menu-view, revision 144110b (MIT).
@interface BitholdContextMenuView : UIView <UIContextMenuInteractionDelegate>
@property(nonatomic, copy) NSArray<NSDictionary *> *actions;
@property(nonatomic, copy) RCTBubblingEventBlock onPress;
@end

@implementation BitholdContextMenuView {
  NSMapTable<UIView *, UIContextMenuInteraction *> *_interactions;
}
- (instancetype)init {
  if ((self = [super init])) {
    _interactions = [NSMapTable weakToStrongObjectsMapTable];
  }
  return self;
}
- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
  [super insertReactSubview:subview atIndex:atIndex];
  UIContextMenuInteraction *interaction = [[UIContextMenuInteraction alloc] initWithDelegate:self];
  [subview addInteraction:interaction];
  [_interactions setObject:interaction forKey:subview];
}
- (void)removeReactSubview:(UIView *)subview {
  UIContextMenuInteraction *interaction = [_interactions objectForKey:subview];
  if (interaction) {
    [subview removeInteraction:interaction];
    [_interactions removeObjectForKey:subview];
  }
  [super removeReactSubview:subview];
}
- (UIContextMenuConfiguration *)contextMenuInteraction:(UIContextMenuInteraction *)interaction configurationForMenuAtLocation:(CGPoint)location {
  return [UIContextMenuConfiguration configurationWithIdentifier:nil previewProvider:nil actionProvider:^UIMenu *(NSArray<UIMenuElement *> *suggestedActions) {
    NSMutableArray<UIMenuElement *> *children = [NSMutableArray new];
    [self.actions enumerateObjectsUsingBlock:^(NSDictionary *item, NSUInteger index, BOOL *stop) {
      UIImage *icon = [UIImage systemImageNamed:item[@"systemIcon"]];
      [children addObject:[UIAction actionWithTitle:item[@"title"] image:icon identifier:nil handler:^(UIAction *action) {
        if (self.onPress) {
          self.onPress(@{@"index": @(index), @"name": action.title});
        }
      }]];
    }];
    return [UIMenu menuWithTitle:@"" children:children];
  }];
}
- (UITargetedPreview *)previewForView:(UIView *)view {
  UIPreviewParameters *parameters = [UIPreviewParameters new];
  parameters.backgroundColor = UIColor.clearColor;
  UIPreviewTarget *target = [[UIPreviewTarget alloc] initWithContainer:self center:view.center];
  return [[UITargetedPreview alloc] initWithView:view parameters:parameters target:target];
}
- (UITargetedPreview *)contextMenuInteraction:(UIContextMenuInteraction *)interaction previewForHighlightingMenuWithConfiguration:(UIContextMenuConfiguration *)configuration {
  return [self previewForView:interaction.view];
}
- (UITargetedPreview *)contextMenuInteraction:(UIContextMenuInteraction *)interaction previewForDismissingMenuWithConfiguration:(UIContextMenuConfiguration *)configuration {
  return interaction.view.window ? [self previewForView:interaction.view] : nil;
}
@end

@interface BitholdContextMenu : RCTViewManager
@end
@implementation BitholdContextMenu
RCT_EXPORT_MODULE(BitholdContextMenu)
- (UIView *)view { return [BitholdContextMenuView new]; }
RCT_EXPORT_VIEW_PROPERTY(actions, NSArray)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
@end
