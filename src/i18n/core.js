import languages from '../features/settings/data/languages.json';
import de from './locales/de.js';
import en from './locales/en.js';
import es419 from './locales/es-419.js';
import fr from './locales/fr.js';
import it from './locales/it.js';
import nl from './locales/nl.js';
import pt from './locales/pt.js';
import ru from './locales/ru.js';

// The languages offered in Settings → Language, and one catalog for each.
// English is the source catalog and the fallback for a missing key.
const catalogs = { de, en, 'es-419': es419, fr, it, nl, pt, ru };
export const LANGUAGE_CODES = languages.map(([code]) => code);
export const DEFAULT_LANGUAGE = 'en';

// Dates follow the selected language. Amounts keep the app's own en-US
// number format, which its digit layouts are measured against.
const DATE_LOCALES = {
  de: 'de-DE',
  en: 'en-US',
  'es-419': 'es-419',
  fr: 'fr-FR',
  it: 'it-IT',
  nl: 'nl-NL',
  pt: 'pt-BR',
  ru: 'ru-RU',
};

// CLDR cardinal plural rules for integer counts. Hermes has no
// Intl.PluralRules, so the rules of the offered languages are spelled out.
function pluralCategory(language, count) {
  const n = Math.abs(Math.trunc(Number(count)));
  if (language === 'ru') {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) {
      return 'one';
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return 'few';
    }
    return 'many';
  }
  if (language === 'fr' || language === 'pt') {
    return n === 0 || n === 1 ? 'one' : 'other';
  }
  return n === 1 ? 'one' : 'other';
}

let current = DEFAULT_LANGUAGE;
const listeners = new Set();

export function isLanguage(code) {
  return LANGUAGE_CODES.includes(code);
}
export function getLanguage() {
  return current;
}
export function dateLocale(language = current) {
  return DATE_LOCALES[language] ?? DATE_LOCALES.en;
}
export function setCurrentLanguage(code) {
  if (!isLanguage(code) || code === current) {
    return;
  }
  current = code;
  listeners.forEach(listener => listener());
}
export function subscribeLanguage(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function lookup(language, key) {
  const value = catalogs[language]?.[key];
  return value === undefined ? en[key] : value;
}
function interpolate(text, params) {
  return params
    ? text.replace(/\{(\w+)\}/g, (match, name) =>
        params[name] === undefined ? match : String(params[name]),
      )
    : text;
}
export function translate(language, key, params) {
  let value = lookup(language, key);
  if (value === undefined) {
    return key;
  }
  if (typeof value === 'object') {
    const category = pluralCategory(language, params?.count ?? 0);
    value = value[category] ?? value.other ?? value.many;
  }
  return interpolate(value, params);
}
export function t(key, params) {
  return translate(current, key, params);
}
