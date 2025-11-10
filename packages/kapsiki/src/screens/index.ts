import {Screen} from '@axelor/aos-mobile-core';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';

export default {
  HomeScreen: {
    title: 'Welcome',
    component: HomeScreen,
    options: {
      shadedHeader: false,
      headerShown: false,
    },
  },
  KapsikiSearchScreen: {
    title: 'Search',
    component: SearchScreen,
    options: {
      shadedHeader: false,
      headerShown: false,
    },
  },
} satisfies Record<string, Screen>;

export {HomeScreen};
