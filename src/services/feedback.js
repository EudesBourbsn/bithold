import { NativeModules } from 'react-native';

let hapticEnabled = true;
export function setHapticEnabled(value) {
  hapticEnabled = value;
}
export function selectionFeedback() {
  if (!hapticEnabled) {
    return;
  }
  NativeModules.BitholdFeedback?.selection();
}
export async function pasteText() {
  return (await NativeModules.BitholdFeedback?.paste()) ?? '';
}

export function notificationFeedback(type = 'error') {
  if (!hapticEnabled) {
    return;
  }
  NativeModules.BitholdFeedback?.notification(type);
}

export function impactFeedback() {
  if (!hapticEnabled) {
    return;
  }
  NativeModules.BitholdFeedback?.impact();
}
export async function readClipboard() {
  return await NativeModules.BitholdMedia.readClipboard();
}
