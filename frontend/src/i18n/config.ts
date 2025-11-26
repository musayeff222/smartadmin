import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import trTranslations from './locales/tr.json';
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import azTranslations from './locales/az.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: trTranslations },
      en: { translation: enTranslations },
      ru: { translation: ruTranslations },
      az: { translation: azTranslations },
    },
    fallbackLng: 'tr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;





