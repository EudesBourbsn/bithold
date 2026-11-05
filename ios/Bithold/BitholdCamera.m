#import <React/RCTViewManager.h>
#import <AVFoundation/AVFoundation.h>

@interface BitholdCameraView : UIView<AVCaptureMetadataOutputObjectsDelegate>
@property(nonatomic,copy) RCTDirectEventBlock onCode;
@property(nonatomic,copy) RCTDirectEventBlock onStatus;
@property(nonatomic,strong) AVCaptureSession *session;
@property(nonatomic,strong) AVCaptureVideoPreviewLayer *preview;
@property(nonatomic,strong) dispatch_queue_t sessionQueue;
@property(nonatomic,assign) BOOL configured;
@property(nonatomic,assign) BOOL active;
@end
@implementation BitholdCameraView
- (instancetype)init {
  if((self=[super init])){
    self.backgroundColor=[UIColor colorWithRed:31.0/255.0 green:33.0/255.0 blue:53.0/255.0 alpha:1.0];
    _session=[AVCaptureSession new];
    _sessionQueue=dispatch_queue_create("com.bithold.camera",DISPATCH_QUEUE_SERIAL);
    _preview=[AVCaptureVideoPreviewLayer layerWithSession:_session];
    _preview.videoGravity=AVLayerVideoGravityResizeAspectFill;
    [self.layer addSublayer:_preview];
    _active=YES;
  }return self;
}
- (void)layoutSubviews {[super layoutSubviews];self.preview.frame=self.bounds;}
- (void)setActive:(BOOL)active {_active=active;[self updateRunning];}
- (void)didMoveToWindow {[super didMoveToWindow];[self updateRunning];}
- (void)status:(NSString *)value {
  dispatch_async(dispatch_get_main_queue(),^{if(self.onStatus){self.onStatus(@{@"status":value});}});
}
- (void)updateRunning {
  BOOL run=self.window!=nil && self.active;
  dispatch_async(self.sessionQueue,^{
    if(!run){if(self.session.isRunning){[self.session stopRunning];}return;}
    if([AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo]!=AVAuthorizationStatusAuthorized){[self status:@"denied"];return;}
    if(!self.configured){
      AVCaptureDevice *device=[AVCaptureDevice defaultDeviceWithDeviceType:AVCaptureDeviceTypeBuiltInWideAngleCamera mediaType:AVMediaTypeVideo position:AVCaptureDevicePositionBack];
      NSError *error;
      AVCaptureDeviceInput *input=device?[AVCaptureDeviceInput deviceInputWithDevice:device error:&error]:nil;
      if(!input){[self status:@"unavailable"];return;}
      AVCaptureMetadataOutput *output=[AVCaptureMetadataOutput new];
      [self.session beginConfiguration];
      if([self.session canSetSessionPreset:AVCaptureSessionPresetHigh]){self.session.sessionPreset=AVCaptureSessionPresetHigh;}
      if(![self.session canAddInput:input]||![self.session canAddOutput:output]){[self.session commitConfiguration];[self status:@"unavailable"];return;}
      [self.session addInput:input];[self.session addOutput:output];
      [output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
      if([output.availableMetadataObjectTypes containsObject:AVMetadataObjectTypeQRCode]){output.metadataObjectTypes=@[AVMetadataObjectTypeQRCode];}
      [self.session commitConfiguration];self.configured=YES;
    }
    if(!self.session.isRunning){[self.session startRunning];}
  });
}
- (void)captureOutput:(AVCaptureOutput *)output didOutputMetadataObjects:(NSArray<__kindof AVMetadataObject *> *)objects fromConnection:(AVCaptureConnection *)connection {
  if(!self.active){return;}
  for(AVMetadataMachineReadableCodeObject *code in objects){if(code.stringValue.length && self.onCode){self.onCode(@{@"value":code.stringValue});return;}}
}
- (void)dealloc {
  AVCaptureSession *session=_session;
  dispatch_async(_sessionQueue,^{if(session.isRunning){[session stopRunning];}});
}
@end
@interface BitholdCamera : RCTViewManager
@end
@implementation BitholdCamera
RCT_EXPORT_MODULE(BitholdCamera)
- (UIView *)view {return [BitholdCameraView new];}
RCT_EXPORT_VIEW_PROPERTY(active, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onCode, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onStatus, RCTDirectEventBlock)
@end
