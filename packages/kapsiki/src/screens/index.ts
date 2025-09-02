import {Screen} from '@axelor/aos-mobile-core';
import WelcomeScreen from './WelcomeScreen';

export default {
  WelcomeScreen: {
    title: 'Welcome',
    component: WelcomeScreen,
    options: {
      shadedHeader: false,
      headerShown: false,
    },
  },
} satisfies Record<string, Screen>;

export {WelcomeScreen};
