/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */

import React, {FunctionComponent} from 'react';
import {Text, View} from 'react-native';
import {useCallback} from 'react';
import {Icon, useThemeColor} from '@axelor/aos-mobile-ui';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useNavigationRoutes} from '@axelor/aos-mobile-core';

export type HeaderProps = {
  title: string;
};

export const Header: FunctionComponent<HeaderProps> = ({title}) => {
  const Colors = useThemeColor();
  const navigation = useNavigation();

  const handlePress = useCallback(
    () => navigation.dispatch(DrawerActions.toggleDrawer()),
    [navigation],
  );
  return (
    <View
      style={{
        height: 66,
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
        }}>
        <Icon
          name={'list'}
          size={26}
          // color={Colors.primaryColor.foreground}
          touchable
          onPress={handlePress}
        />
        <Text
          style={{
            fontSize: 20,
            // color: Colors.primaryColor.foreground,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
      </View>
      <Icon
        name={'gear'}
        size={20}
        // color={Colors.primaryColor.foreground}
        touchable
        onPress={handlePress}
      />
    </View>
  );
};
