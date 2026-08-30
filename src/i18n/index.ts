import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loadLocale } from '../utils/userPrefs';
import enCommon from './locales/en/common.json';
import zhCommon from './locales/zh/common.json';

const locale = loadLocale();

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
}

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
    },
    zh: {
      common: zhCommon,
    },
  },
  lng: locale,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
