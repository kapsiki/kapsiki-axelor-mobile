/* eslint-disable react-native/no-inline-styles */
import React, {FunctionComponent, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon, Screen, useThemeColor} from '@axelor/aos-mobile-ui';
import {ScrollView} from 'react-native';
import Slider from './slider';

export type TabNavigationProps = {
  screens: {
    screen: FunctionComponent<any>;
    title: string;
    icon: string;
  }[];
  selectedScreenIndex?: number;
};

export const TabNavigation: FunctionComponent<TabNavigationProps> = ({
  screens,
  selectedScreenIndex,
}) => {
  const [activeScreenIndex, setActiveScreenIndex] =
    useState(selectedScreenIndex);
  const Colors = useThemeColor();
  return (
    <Screen style={{flex: 1}} removeSpaceOnTop={true}>
      <ScrollView
        scrollEnabled
        style={{gap: 20, flex: 1, paddingBottom: 20}}
        nestedScrollEnabled={true} // Enable nested scrolling
        showsVerticalScrollIndicator={true}>
        <Slider
          showButtons={false}
          showDots={false}
          initialIndex={activeScreenIndex}
          onIndexChange={index => setActiveScreenIndex(index)}
          containerStyle={{flex: 1, width: '100%', height: 'auto'}}
          slides={screens.map(screen => (
            <View style={{flex: 1, width: '100%'}}>
              <screen.screen />
            </View>
          ))}
        />
      </ScrollView>
      {/* Bottom Navigation */}
      <View
        style={{
          height: 76,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 20,
        }}>
        {/* Render bottom navigation buttons */}
        {screens.map((screen, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveScreenIndex(index)}>
            <Icon
              name={screen.icon}
              size={20}
              color={
                index === activeScreenIndex
                  ? Colors.primaryColor.background
                  : Colors.text + '30'
              }
            />
            <Text
              style={{
                fontSize: 12,
                color:
                  index === activeScreenIndex
                    ? Colors.primaryColor.background
                    : Colors.text + '30',
              }}>
              {screen.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
};
