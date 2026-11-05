import { Platform, View, requireNativeComponent } from 'react-native';

export const NativeBlurMaterial =
  Platform.OS === 'ios' ? requireNativeComponent('BitholdSendBlur') : View;
