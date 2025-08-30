/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Screen} from '@axelor/aos-mobile-ui';
import {SearchInput} from '../components/welcome/search-input';
import {ScrollView} from 'react-native';
import {QuickLinks} from '../components/welcome/quick-links';
import {Projects} from '../components/welcome/projects';
const WelcomeView = () => {
  return (
    <Screen style={{flex: 1}} removeSpaceOnTop={true}>
      <ScrollView
        scrollEnabled
        nestedScrollEnabled={true} // Enable nested scrolling
        showsVerticalScrollIndicator={true}>
        <SearchInput />
        <QuickLinks />
        <Projects />
      </ScrollView>
    </Screen>
  );
};

export default WelcomeView;
