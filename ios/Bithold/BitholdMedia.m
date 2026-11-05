#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <React/RCTInvalidating.h>
#import <UIKit/UIKit.h>
#import <Photos/Photos.h>
#import <PhotosUI/PhotosUI.h>
#import <AVFoundation/AVFoundation.h>

@interface BitholdMedia : NSObject<RCTBridgeModule, RCTInvalidating,
    PHPickerViewControllerDelegate, UIImagePickerControllerDelegate,
    UINavigationControllerDelegate, UIAdaptivePresentationControllerDelegate>
@property(nonatomic, copy) RCTPromiseResolveBlock walletPhotoResolve;
@property(nonatomic, copy) RCTPromiseRejectBlock walletPhotoReject;
@property(nonatomic, copy) NSString *walletPhotoToken;
@property(nonatomic, strong) UIViewController *walletPhotoPicker;
@property(nonatomic) BOOL walletPhotoFinishing;
@property(nonatomic) BOOL invalidated;
@end

// Draw through UIImage so EXIF rotation/mirroring is baked into the pixels.
// Only the opaque, square JPEG crosses the bridge; source metadata is omitted.
static NSData *BitholdWalletPhotoData(UIImage *image) {
  if (!image || image.size.width <= 0 || image.size.height <= 0) { return nil; }
  const CGFloat side = 512;
  CGFloat scale = MAX(side / image.size.width, side / image.size.height);
  CGRect rect = CGRectMake((side - image.size.width * scale) / 2,
                           (side - image.size.height * scale) / 2,
                           image.size.width * scale, image.size.height * scale);
  UIGraphicsImageRendererFormat *format = [UIGraphicsImageRendererFormat defaultFormat];
  format.scale = 1;
  format.opaque = YES;
  format.preferredRange = UIGraphicsImageRendererFormatRangeStandard;
  UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc]
      initWithSize:CGSizeMake(side, side) format:format];
  UIImage *square = [renderer imageWithActions:^(UIGraphicsImageRendererContext *context) {
    [UIColor.whiteColor setFill];
    UIRectFill(CGRectMake(0, 0, side, side));
    [image drawInRect:rect];
  }];
  for (NSInteger quality = 88; quality >= 8; quality -= 10) {
    NSData *data = UIImageJPEGRepresentation(square, quality / 100.0);
    if (data && data.length <= 160000) { return data; }
  }
  return nil;
}
static NSData *BitholdQrData(NSString *base64) {
  UIImage *image=[UIImage imageWithData:[[NSData alloc] initWithBase64EncodedString:base64 options:0]];
  if(!image){return nil;}
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(1024,1024),YES,1);
  [UIColor.whiteColor setFill];UIRectFill(CGRectMake(0,0,1024,1024));
  [image drawInRect:CGRectMake(0,0,1024,1024)];
  UIImage *result=UIGraphicsGetImageFromCurrentImageContext();UIGraphicsEndImageContext();
  return UIImagePNGRepresentation(result);
}
static NSMutableDictionary<NSString *, AVAudioPlayer *> *BitholdSoundPlayers;
// Configure audio and load sounds off the main thread to avoid blocking animations.
static dispatch_queue_t BitholdSoundQueue(void) {
  static dispatch_queue_t queue;
  static dispatch_once_t once;
  dispatch_once(&once, ^{
    queue=dispatch_queue_create("bithold.sound", DISPATCH_QUEUE_SERIAL);
  });
  return queue;
}
@implementation BitholdMedia
RCT_EXPORT_MODULE();
+ (BOOL)requiresMainQueueSetup {return YES;}
- (dispatch_queue_t)methodQueue {return dispatch_get_main_queue();}
RCT_EXPORT_METHOD(imageData:(NSString *)uri resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSURL *url=[NSURL URLWithString:uri];
  UIImage *source=[UIImage imageWithContentsOfFile:url.path];
  NSData *data=source ? UIImagePNGRepresentation(source) : nil;
  if(!data){reject(@"image_unavailable",@"Bitcoin icon unavailable.",nil);return;}
  resolve([@"data:image/png;base64," stringByAppendingString:[data base64EncodedStringWithOptions:0]]);
}
RCT_EXPORT_METHOD(playSound:(NSString *)uri) {
  NSURL *url=[NSURL URLWithString:uri];
  if(!url.isFileURL){return;}
  dispatch_async(BitholdSoundQueue(), ^{
    if(!BitholdSoundPlayers){
      BitholdSoundPlayers=[NSMutableDictionary new];
      [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryAmbient error:nil];
    }
    AVAudioPlayer *player=BitholdSoundPlayers[uri];
    if(!player){
      player=[[AVAudioPlayer alloc] initWithContentsOfURL:url error:nil];
      if(!player){return;}
      [player prepareToPlay];
      BitholdSoundPlayers[uri]=player;
    }
    player.currentTime=0;
    [player play];
  });
}
RCT_EXPORT_METHOD(copyText:(NSString *)text resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  UIPasteboard.generalPasteboard.string = text;
  resolve(@YES);
}
// A private key: kept off Universal Clipboard (this device only) and cleared
// from the clipboard after two minutes.
RCT_EXPORT_METHOD(copySecret:(NSString *)text resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [UIPasteboard.generalPasteboard setItems:@[@{UIPasteboardTypeListString.firstObject: text}]
                                   options:@{UIPasteboardOptionLocalOnly: @YES,
                                             UIPasteboardOptionExpirationDate: [NSDate dateWithTimeIntervalSinceNow:120]}];
  resolve(@YES);
}
RCT_EXPORT_METHOD(readClipboard:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  UIPasteboard *board = UIPasteboard.generalPasteboard;
  resolve(@{@"text":board.string ?: @"", @"changeCount":@(board.changeCount)});
}
RCT_EXPORT_METHOD(requestCamera:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  if(status == AVAuthorizationStatusNotDetermined){
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted){resolve(granted ? @"authorized" : @"denied");}];
  }else {resolve(status == AVAuthorizationStatusAuthorized ? @"authorized" : @"denied");}
}

// One request owns the native picker from authorization through image encoding.
// A request token also prevents late provider/permission callbacks from settling
// a newer request after bridge invalidation or a previous completion.
- (BOOL)isWalletPhotoRequest:(NSString *)token {
  return !self.invalidated && token && [self.walletPhotoToken isEqualToString:token];
}
- (void)finishWalletPhoto:(id)result
                    code:(NSString *)code
                 message:(NSString *)message
                   error:(NSError *)error
                   token:(NSString *)token {
  if (![self.walletPhotoToken isEqualToString:token]) { return; }
  RCTPromiseResolveBlock resolve = self.walletPhotoResolve;
  RCTPromiseRejectBlock reject = self.walletPhotoReject;
  self.walletPhotoResolve = nil;
  self.walletPhotoReject = nil;
  self.walletPhotoToken = nil;
  self.walletPhotoPicker = nil;
  self.walletPhotoFinishing = NO;
  if (code) { if (reject) { reject(code, message, error); } }
  else if (resolve) { resolve(result ?: (id)kCFNull); }
}
- (void)dismissWalletPhotoPicker:(UIViewController *)picker completion:(dispatch_block_t)completion {
  if (picker.presentingViewController && !picker.isBeingDismissed) {
    [picker dismissViewControllerAnimated:YES completion:completion];
  } else {
    completion();
  }
}
- (void)cancelWalletPhotoPicker:(UIViewController *)picker {
  if (picker != self.walletPhotoPicker || self.walletPhotoFinishing) { return; }
  self.walletPhotoFinishing = YES;
  NSString *token = self.walletPhotoToken;
  [self dismissWalletPhotoPicker:picker completion:^{
    [self finishWalletPhoto:nil code:nil message:nil error:nil token:token];
  }];
}
- (void)encodeWalletPhoto:(UIImage *)image token:(NSString *)token {
  dispatch_async(dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^{
    @autoreleasepool {
      NSData *data = BitholdWalletPhotoData(image);
      NSDictionary *result = data ? @{@"base64":[data base64EncodedStringWithOptions:0],
                                      @"width":@512, @"height":@512,
                                      @"mimeType":@"image/jpeg"} : nil;
      dispatch_async(dispatch_get_main_queue(), ^{
        if (![self isWalletPhotoRequest:token]) { return; }
        [self finishWalletPhoto:result code:result ? nil : @"photo_encode_failed"
                        message:@"The photo could not be prepared. Please choose another photo."
                          error:nil token:token];
      });
    }
  });
}
- (void)presentWalletPhotoSource:(NSString *)source token:(NSString *)token {
  [self presentWalletPhotoSource:source token:token attempt:0];
}
- (void)presentWalletPhotoSource:(NSString *)source token:(NSString *)token attempt:(NSUInteger)attempt {
  if (![self isWalletPhotoRequest:token]) { return; }
  UIViewController *presenter = RCTPresentedViewController();
  if (!presenter || !presenter.view.window || presenter.isBeingDismissed ||
      presenter.isBeingPresented || presenter.presentedViewController ||
      UIApplication.sharedApplication.applicationState != UIApplicationStateActive) {
    // The permission alert or the avatar-options sheet may still be leaving.
    // Keep ownership during this bounded wait rather than presenting twice.
    if (attempt < 10) {
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)),
                     dispatch_get_main_queue(), ^{
        [self presentWalletPhotoSource:source token:token attempt:attempt + 1];
      });
      return;
    }
    [self finishWalletPhoto:nil code:@"photo_presenter_unavailable"
                    message:@"Please try again when the current screen is ready."
                      error:nil token:token];
    return;
  }
  UIViewController *controller;
  if ([source isEqualToString:@"library"]) {
    // The system picker grants access only to the selected image; do not ask
    // for PHPhotoLibrary authorization, even when library access is limited.
    PHPickerConfiguration *configuration = [[PHPickerConfiguration alloc] init];
    configuration.filter = PHPickerFilter.imagesFilter;
    configuration.selectionLimit = 1;
    PHPickerViewController *picker = [[PHPickerViewController alloc] initWithConfiguration:configuration];
    picker.delegate = self;
    controller = picker;
  } else {
    if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
      [self finishWalletPhoto:nil code:@"camera_unavailable"
                      message:@"This device does not have an available camera." error:nil token:token];
      return;
    }
    UIImagePickerController *picker = [UIImagePickerController new];
    picker.sourceType = UIImagePickerControllerSourceTypeCamera;
    picker.mediaTypes = @[@"public.image"];
    picker.allowsEditing = YES;
    picker.delegate = self;
    picker.modalPresentationStyle = UIModalPresentationFullScreen;
    controller = picker;
  }
  self.walletPhotoPicker = controller;
  controller.presentationController.delegate = self;
  [presenter presentViewController:controller animated:YES completion:nil];
  controller.presentationController.delegate = self;
}
RCT_EXPORT_METHOD(pickWalletPhoto:(NSString *)source
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (self.walletPhotoToken) {
    reject(@"photo_picker_busy", @"A photo picker is already open.", nil);
    return;
  }
  if (self.invalidated || !([source isEqualToString:@"library"] || [source isEqualToString:@"camera"])) {
    reject(@"photo_source_invalid", @"Choose the camera or photo library.", nil);
    return;
  }
  self.walletPhotoResolve = resolve;
  self.walletPhotoReject = reject;
  self.walletPhotoToken = NSUUID.UUID.UUIDString;
  NSString *token = self.walletPhotoToken;
  if ([source isEqualToString:@"library"]) {
    [self presentWalletPhotoSource:source token:token];
    return;
  }
  if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
    [self finishWalletPhoto:nil code:@"camera_unavailable"
                    message:@"This device does not have an available camera." error:nil token:token];
    return;
  }
  AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  if (status == AVAuthorizationStatusNotDetermined) {
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (![self isWalletPhotoRequest:token]) { return; }
        if (granted) { [self presentWalletPhotoSource:source token:token]; }
        else {
          [self finishWalletPhoto:nil code:@"camera_access_denied"
                          message:@"Allow camera access in Settings to take a wallet photo."
                            error:nil token:token];
        }
      });
    }];
  } else if (status == AVAuthorizationStatusAuthorized) {
    [self presentWalletPhotoSource:source token:token];
  } else {
    [self finishWalletPhoto:nil code:@"camera_access_denied"
                    message:@"Allow camera access in Settings to take a wallet photo."
                      error:nil token:token];
  }
}
- (void)picker:(PHPickerViewController *)picker didFinishPicking:(NSArray<PHPickerResult *> *)results {
  if (picker != self.walletPhotoPicker || self.walletPhotoFinishing) { return; }
  if (results.count == 0) { [self cancelWalletPhotoPicker:picker]; return; }
  self.walletPhotoFinishing = YES;
  NSString *token = self.walletPhotoToken;
  NSItemProvider *provider = results.firstObject.itemProvider;
  [self dismissWalletPhotoPicker:picker completion:^{
    if (![self isWalletPhotoRequest:token]) { return; }
    if (![provider canLoadObjectOfClass:UIImage.class]) {
      [self finishWalletPhoto:nil code:@"photo_load_failed"
                      message:@"This photo could not be opened. Please choose another photo."
                        error:nil token:token];
      return;
    }
    [provider loadObjectOfClass:UIImage.class completionHandler:^(id<NSItemProviderReading> object, NSError *error) {
      dispatch_async(dispatch_get_main_queue(), ^{
        if (![self isWalletPhotoRequest:token]) { return; }
        if (error || ![(id)object isKindOfClass:UIImage.class]) {
          [self finishWalletPhoto:nil code:@"photo_load_failed"
                          message:@"This photo could not be opened. Please choose another photo."
                            error:error token:token];
        } else {
          [self encodeWalletPhoto:(UIImage *)object token:token];
        }
      });
    }];
  }];
}
- (void)imagePickerController:(UIImagePickerController *)picker
    didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info {
  if (picker != self.walletPhotoPicker || self.walletPhotoFinishing) { return; }
  self.walletPhotoFinishing = YES;
  NSString *token = self.walletPhotoToken;
  UIImage *image = info[UIImagePickerControllerEditedImage] ?: info[UIImagePickerControllerOriginalImage];
  [self dismissWalletPhotoPicker:picker completion:^{
    if (![self isWalletPhotoRequest:token]) { return; }
    if (!image) {
      [self finishWalletPhoto:nil code:@"photo_load_failed"
                      message:@"The camera photo could not be opened." error:nil token:token];
    } else {
      [self encodeWalletPhoto:image token:token];
    }
  }];
}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
  [self cancelWalletPhotoPicker:picker];
}
- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController {
  [self cancelWalletPhotoPicker:presentationController.presentedViewController];
}
- (void)invalidate {
  dispatch_async(dispatch_get_main_queue(), ^{
    self.invalidated = YES;
    UIViewController *picker = self.walletPhotoPicker;
    NSString *token = self.walletPhotoToken;
    if (picker.presentingViewController) { [picker dismissViewControllerAnimated:NO completion:nil]; }
    if (token) { [self finishWalletPhoto:nil code:nil message:nil error:nil token:token]; }
  });
}

RCT_EXPORT_METHOD(saveImage:(NSString *)base64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSData *data = BitholdQrData(base64);
  UIImage *image = [UIImage imageWithData:data];
  if(!image){reject(@"invalid_image",@"The QR image could not be saved.",nil);return;}
  [PHPhotoLibrary requestAuthorizationForAccessLevel:PHAccessLevelAddOnly handler:^(PHAuthorizationStatus status){
    if(status != PHAuthorizationStatusAuthorized && status != PHAuthorizationStatusLimited){reject(@"photo_access_denied",@"Photo access denied.",nil);return;}
    [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{[PHAssetChangeRequest creationRequestForAssetFromImage:image];} completionHandler:^(BOOL success,NSError *error){if(success){resolve(@YES);}else{reject(@"photo_save_failed",@"The QR image could not be saved.",error);}}];
  }];
}
RCT_EXPORT_METHOD(copyImage:(NSString *)base64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  UIImage *image = [UIImage imageWithData:BitholdQrData(base64)];
  if(!image){reject(@"invalid_image",@"Please try again.",nil);return;}
  UIPasteboard.generalPasteboard.image = image;
  resolve(@YES);
}
RCT_EXPORT_METHOD(shareImage:(NSString *)base64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSData *data = BitholdQrData(base64);
  if(![UIImage imageWithData:data]){reject(@"invalid_image",@"Please try again.",nil);return;}
  NSURL *folder = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:NSUUID.UUID.UUIDString] isDirectory:YES];
  NSError *error;
  [[NSFileManager defaultManager] createDirectoryAtURL:folder withIntermediateDirectories:YES attributes:nil error:&error];
  NSURL *file = [folder URLByAppendingPathComponent:@"bithold-qr.png"];
  if(![data writeToURL:file options:NSDataWritingAtomic error:&error]){reject(@"share_failed",@"Please try again.",error);return;}
  UIViewController *presenter = RCTPresentedViewController();
  UIActivityViewController *controller = [[UIActivityViewController alloc] initWithActivityItems:@[file] applicationActivities:nil];
  controller.popoverPresentationController.sourceView = presenter.view;
  controller.popoverPresentationController.sourceRect = CGRectMake(CGRectGetMidX(presenter.view.bounds),CGRectGetMidY(presenter.view.bounds),1,1);
  controller.completionWithItemsHandler = ^(UIActivityType activity,BOOL completed,NSArray *items,NSError *activityError){
    [[NSFileManager defaultManager] removeItemAtURL:folder error:nil];
    if(activityError){reject(@"share_failed",@"Please try again.",activityError);}else{resolve(@(completed));}
  };
  [presenter presentViewController:controller animated:YES completion:nil];
}
@end
