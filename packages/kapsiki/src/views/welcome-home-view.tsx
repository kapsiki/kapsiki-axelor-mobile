import React from 'react';
import {Header} from '../components/header';
import {useTranslator} from '@axelor/aos-mobile-core';
import {SearchButton} from '../components/search-button';
import {QuickLinks} from '../components/quick-links';
import {UpcomingEvents} from '../components/upcoming-event';
const WelcomeHomeView = () => {
  const I18n = useTranslator();
  return (
    <>
      <Header title={I18n.t('Welcome')} />
      <SearchButton />
      <QuickLinks />
      <UpcomingEvents />
    </>
  );
};

export default WelcomeHomeView;
