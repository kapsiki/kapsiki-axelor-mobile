/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Screen} from '@axelor/aos-mobile-ui';
import {SearchInput} from '../components/welcome/search-input';
import {ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {QuickLinks} from '../components/welcome/quick-links';
import {Projects} from '../components/welcome/projects';
import TabBarNavigator from '../components/tab-navigator';
const WelcomeScreen = () => {
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
const screens = [
  {
    title: 'Home',
    component: WelcomeScreen,
    headerStyle: {backgroundColor: '#fff'},
  },
  // ... more screens
];
const FirstRoute = () => (
  <View style={[styles.container, {backgroundColor: '#ff4081'}]} />
);
const SecondRoute = () => (
  <View style={[styles.container, {backgroundColor: '#673ab7'}]} />
);

export default () => (
  <TabBarNavigator
    screens={[
      ...screens,
      {component: FirstRoute, title: 'projects'},
      {component: SecondRoute, title: 'tasks'},
    ]}
    initialTab={0}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: StatusBar.currentHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
