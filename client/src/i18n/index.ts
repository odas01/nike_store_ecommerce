import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import viResources from '@/locales/vi';
import enResources from '@/locales/en';

export const resources = {
   vi: viResources,
   en: enResources,
};

export const defaultNS = 'mutual';

i18n.use(initReactI18next).init({
   resources,
   lng: 'vi',
   fallbackLng: 'en',
   ns: ['home', 'dashboard', 'mutual'],
   interpolation: {
      escapeValue: false,
   },
});

export default i18n;
