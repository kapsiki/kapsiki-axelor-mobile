/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Screen} from '@axelor/aos-mobile-ui';
import {ScrollView} from 'react-native';
import {Header} from '../components/header';
import {useTranslator} from '@axelor/aos-mobile-core';
const WelcomeHomeView = () => {
  const I18n = useTranslator();
  return (
    <Screen style={{flex: 1}} removeSpaceOnTop={true}>
      <ScrollView
        scrollEnabled
        nestedScrollEnabled={true} // Enable nested scrolling
        showsVerticalScrollIndicator={true}>
        <Header title={I18n.t('Welcome')} />
      </ScrollView>
    </Screen>
  );
};

export default WelcomeHomeView;
