import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import type { SupportedLanguage } from '@/types';

import en from './locales/en.json';
import zu from './locales/zu.json';
import af from './locales/af.json';
import xh from './locales/xh.json';

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'zu', label: 'Zulu', nativeLabel: 'isiZulu' },
  { code: 'af', label: 'Afrikaans', nativeLabel: 'Afrikaans' },
  { code: 'xh', label: 'Xhosa', nativeLabel: 'isiXhosa' },
];

export const resources = {
  en: { translation: en },
  zu: { translation: zu },
  af: { translation: af },
  xh: { translation: xh },
} as const;

/** Picks the best supported language from the device locale, defaulting to English. */
export function detectDeviceLanguage(): SupportedLanguage {
  try {
    const codes = getLocales().map((l) => l.languageCode);
    const match = codes.find((c): c is SupportedLanguage =>
      ['en', 'zu', 'af', 'xh'].includes(c ?? '')
    );
    return match ?? 'en';
  } catch {
    return 'en';
  }
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: detectDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export function changeLanguage(lang: SupportedLanguage): void {
  void i18n.changeLanguage(lang);
}

export default i18n;
