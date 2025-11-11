import React from 'react';
import {Header} from '../components/header';
import {useTranslator} from '@axelor/aos-mobile-core';
import {SearchButton} from '../components/search-button';
import {QuickLinks} from '../components/quick-links';
import {UpcomingEvents} from '../components/upcoming-event';
import {View} from 'react-native';
const WelcomeHomeView = () => {
  const I18n = useTranslator();
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Header title={I18n.t('Welcome')} />
      <SearchButton />
      <QuickLinks />
      <UpcomingEvents />
    </View>
  );
};

export default WelcomeHomeView;
