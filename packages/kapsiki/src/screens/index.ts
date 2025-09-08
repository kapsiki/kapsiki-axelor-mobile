import {Screen} from '@axelor/aos-mobile-core';
import HomeScreen from './HomeScreen';

export default {
  HomeScreen: {
    title: 'Welcome',
    component: HomeScreen,
    options: {
      shadedHeader: false,
      headerShown: false,
    },
  },
} satisfies Record<string, Screen>;

export {HomeScreen};
