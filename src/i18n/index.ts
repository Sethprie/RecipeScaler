import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import es from './es.json';
import en from './en.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
} as const;

// Get device locale, default to Spanish if any Spanish variant, otherwise English
const getDeviceLanguage = (): string => {
  const locale = Localization.getLocales()[0];
  const languageCode = locale.languageCode;
  
  // If device is set to any Spanish variant, default to Spanish
  if (languageCode === 'es') {
    return 'es';
  }
  
  // Default to English for all other languages
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;
