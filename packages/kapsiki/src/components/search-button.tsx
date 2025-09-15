/* eslint-disable react-native/no-inline-styles */
import {FunctionComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  NavigationObject,
  useNavigation,
  useTranslator,
} from '@axelor/aos-mobile-core';
import {Icon, useThemeColor} from '@axelor/aos-mobile-ui';

export type SearchButtonProps = {};

export const SearchButton: FunctionComponent<SearchButtonProps> = () => {
  const navigation = useNavigation() as NavigationObject;
  const I18n = useTranslator();
  const Colors = useThemeColor();

  return (
    <View
      style={{
        width: '100%',
        padding: 20,
        paddingTop: 0,
        gap: 20,
        // position: 'relative',
        // zIndex: 1,
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('KapsikiSearchScreen');
        }}
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.screenBackgroundColor,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
        <View
          style={{
            paddingLeft: 20,
            backgroundColor: Colors.screenBackgroundColor,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="search" size={20} color={Colors.placeholderTextColor} />
        </View>
        <Text
          style={{
            backgroundColor: Colors.screenBackgroundColor,
            color: Colors.placeholderTextColor,
            flex: 1,
            paddingHorizontal: 20,
            fontSize: 16,
          }}>
          {I18n.t('search_placeholder')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
