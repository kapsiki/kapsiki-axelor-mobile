import {Module} from '@axelor/aos-mobile-core';
import enTranslations from './i18n/en.json';
import frTranslations from './i18n/fr.json';
import screens from './screens';
export const WelcomeModule: Module = {
  name: 'kapsiki-welcome',
  title: 'Kapsiki_Welcome',
  subtitle: 'Kapsiki_Welcome',
  translations: {
    en: enTranslations,
    fr: frTranslations,
  },
  menus: {
    welcome_menu: {
      title: 'Kapsiki_Welcome',
      icon: 'clipboard2-check',
      screen: 'WelcomeScreen',
    },
  },
  screens: {
    ...screens,
  },
  // Module implementation
};
