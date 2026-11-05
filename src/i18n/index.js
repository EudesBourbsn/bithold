import { useSyncExternalStore } from 'react';
import { NativeModules } from 'react-native';
import {
  DEFAULT_LANGUAGE,
  getLanguage,
  isLanguage,
  setCurrentLanguage,
  subscribeLanguage,
  translate,
} from './core.js';

export {
  LANGUAGE_CODES,
  dateLocale,
  getLanguage,
  isLanguage,
  t,
} from './core.js';

const native = NativeModules.BitholdFeedback;

// The language chosen in Settings is kept in the app's own defaults and read
// synchronously at launch, so the first frame is already in that language.
// Until one is chosen, the app follows the iOS language when it is offered.
function initialLanguage() {
  const stored = native?.language;
  if (isLanguage(stored)) {
    return stored;
  }
  const system = native?.preferredLanguage ?? '';
  if (isLanguage(system)) {
    return system;
  }
  const base = system.split('-')[0];
  if (base === 'es') {
    return 'es-419';
  }
  return isLanguage(base) ? base : DEFAULT_LANGUAGE;
}
setCurrentLanguage(initialLanguage());

export function setLanguage(code) {
  if (!isLanguage(code)) {
    return;
  }
  setCurrentLanguage(code);
  native?.setLanguage?.(code);
}

const bound = {};
function boundTranslate(language) {
  if (!bound[language]) {
    bound[language] = (key, params) => translate(language, key, params);
  }
  return bound[language];
}

// Re-renders the calling component when the language changes. The returned
// function is bound to the current language, so memoised values that depend
// on it change with the language too.
export function useLanguage() {
  return useSyncExternalStore(subscribeLanguage, getLanguage);
}
export function useT() {
  return boundTranslate(useLanguage());
}
