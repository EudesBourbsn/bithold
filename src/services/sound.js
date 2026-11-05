import { Image, NativeModules } from 'react-native';

const SOUNDS = {
  receive: require('../../assets/sounds/receive.wav'),
  send: require('../../assets/sounds/send.wav'),
};
let last = 0;
let enabled = true;

export function setSoundEnabled(value) {
  enabled = value !== false;
}

export function playSound(name, { preview = false } = {}) {
  if (!enabled || !SOUNDS[name]) {
    return;
  }
  const now = Date.now();
  if (!preview && now - last < 1000) {
    return;
  }
  const uri = Image.resolveAssetSource(SOUNDS[name])?.uri;
  if (uri) {
    if (!preview) {
      last = now;
    }
    NativeModules.BitholdMedia?.playSound(uri);
  }
}
