#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import <sys/utsname.h>

@interface BitholdFeedback : NSObject <RCTBridgeModule>
@end
@implementation BitholdFeedback
RCT_EXPORT_MODULE();
+ (BOOL)requiresMainQueueSetup { return YES; }
- (dispatch_queue_t)methodQueue { return dispatch_get_main_queue(); }
- (NSDictionary *)constantsToExport {
  struct utsname info;
  uname(&info);
  NSString *model = NSProcessInfo.processInfo.environment[@"SIMULATOR_MODEL_IDENTIFIER"] ?: [NSString stringWithUTF8String:info.machine];
  NSDictionary *radii = @{@"iPhone19,2":@67,@"iPhone19,3":@67,@"iPhone19,7":@67,@"iPhone18,1":@67,@"iPhone18,2":@67,@"iPhone18,4":@67,@"iPhone18,3":@64,@"iPhone17,1":@64,@"iPhone17,2":@64,@"iPhone18,5":@49,@"iPhone17,3":@49,@"iPhone17,4":@49,@"iPhone17,5":@49,@"iPhone16,1":@56,@"iPhone16,2":@56,@"iPhone15,4":@56,@"iPhone15,5":@56,@"iPhone15,2":@56,@"iPhone15,3":@56,@"iPhone14,8":@56,@"iPhone14,3":@56,@"iPhone13,4":@56,@"iPhone14,7":@48,@"iPhone14,2":@48,@"iPhone14,5":@48,@"iPhone13,2":@48,@"iPhone13,3":@48,@"iPhone14,4":@44,@"iPhone13,1":@44};
  // The language chosen in Settings, and the bundle's best match for the iOS
  // language list, which the app follows until a language is chosen.
  NSString *language = [NSUserDefaults.standardUserDefaults stringForKey:@"BitholdLanguage"] ?: @"";
  NSString *preferredLanguage = NSBundle.mainBundle.preferredLocalizations.firstObject ?: @"";
  return @{@"screenCornerRadius":radii[model] ?: @0, @"applicationVersion":[NSBundle.mainBundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"] ?: @"", @"buildNumber":[NSBundle.mainBundle objectForInfoDictionaryKey:@"CFBundleVersion"] ?: @"", @"language":language, @"preferredLanguage":preferredLanguage};
}
// Keeps the chosen language, and makes it the app's iOS language too, so the
// system permission prompts and menus follow it from the next launch.
RCT_EXPORT_METHOD(setLanguage:(NSString *)language) {
  [NSUserDefaults.standardUserDefaults setObject:language forKey:@"BitholdLanguage"];
  [NSUserDefaults.standardUserDefaults setObject:@[language] forKey:@"AppleLanguages"];
}
RCT_EXPORT_METHOD(impact) {
  UIImpactFeedbackGenerator *feedback = [[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleLight];
  [feedback impactOccurred];
}
RCT_EXPORT_METHOD(selection) {
  [[UISelectionFeedbackGenerator new] selectionChanged];
}
RCT_EXPORT_METHOD(notification:(NSString *)type) {
  UINotificationFeedbackType kind = [type isEqualToString:@"success"] ? UINotificationFeedbackTypeSuccess : [type isEqualToString:@"warning"] ? UINotificationFeedbackTypeWarning : UINotificationFeedbackTypeError;
  [[UINotificationFeedbackGenerator new] notificationOccurred:kind];
}
RCT_EXPORT_METHOD(paste:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve(UIPasteboard.generalPasteboard.string ?: @"");
}
@end
