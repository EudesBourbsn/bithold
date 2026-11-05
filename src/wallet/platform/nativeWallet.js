import { NativeEventEmitter, NativeModules } from 'react-native';
import { t } from '../../i18n/core.js';
import { WalletEngine } from '../WalletEngine.js';

const native = NativeModules.BitholdWallet;
const emitter = native ? new NativeEventEmitter(native) : null;
// The native module rejects in English; its errors reach the app's alerts,
// so they are given in the app's language here, keeping their codes.
const STORAGE_MESSAGES = {
  storageGet: 'native.storageRead',
  storageSet: 'native.storageSave',
  storageRemove: 'native.storageRemove',
};
const NATIVE_MESSAGES = {
  'Invalid entropy size': 'native.entropySize',
  'Secure randomness unavailable': 'native.randomness',
  'Authentication was not completed': 'auth.notCompleted',
  'Invalid server': 'native.invalidServer',
  'TLS connection failed': 'native.tlsFailed',
  'TCP connection failed': 'native.tcpFailed',
  'Connection timed out': 'native.connectTimeout',
  'Certificate changed': 'native.certificateChanged',
  'Untrusted certificate': 'native.certificateUntrusted',
  'Invalid or overlapping server request': 'native.overlappingRequest',
  'Server request timed out': 'native.timeout',
  'Unable to send server request': 'native.sendFailed',
  'Server response too large': 'native.responseTooLarge',
  'Invalid server response': 'native.invalidResponse',
  'Unexpected server response': 'native.unexpectedResponse',
  'Server disconnected': 'native.disconnected',
  'Connection closed': 'native.connectionClosed',
};
const ASYNC_METHODS = new Set([
  'getNotificationPermission',
  'requestNotificationPermission',
  'randomBytes',
  'storageGet',
  'storageSet',
  'storageRemove',
  'authorize',
  'authenticateBiometrics',
  'connect',
  'exchange',
  'close',
]);
function localized(method, error) {
  const key =
    error?.code === 'storage'
      ? STORAGE_MESSAGES[method]
      : NATIVE_MESSAGES[error?.message];
  if (!key) {
    return error;
  }
  const translated = new Error(t(key));
  translated.code = error.code;
  return translated;
}
export const walletNative = native
  ? new Proxy(native, {
      get: (target, name) =>
        ASYNC_METHODS.has(name)
          ? (...args) =>
              target[name](...args).catch(error => {
                throw localized(name, error);
              })
          : target[name],
    })
  : null;
const unavailable = async () => {
  throw new Error(t('native.unavailable'));
};
const transport = walletNative ?? new Proxy({}, { get: () => unavailable });
export const walletEngine = new WalletEngine(transport, listener => {
  const subscription = emitter?.addListener('walletSocket', listener);
  return () => subscription?.remove();
});
