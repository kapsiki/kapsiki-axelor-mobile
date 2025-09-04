/*
 * Axelor Business Solutions
 *
 * Copyright (C) 2025 Axelor (<http://axelor.com>).
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useEffect, useMemo} from 'react';
import {StyleSheet, Touchable, TouchableOpacity, View} from 'react-native';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';
import {Color, useThemeColor} from '../../../theme';
import {NumberBubble} from '../../molecules';
import ItemTitle from './ItemTitle';
import {Icon} from '../../atoms';

const BarItem = ({
  iconName,
  color,
  title,
  isSelected = false,
  size,
  disabled,
  indicator,
  onPress,
}: {
  iconName: string;
  color?: Color;
  title?: string;
  isSelected: boolean;
  size: number;
  disabled?: boolean;
  indicator?: number;
  onPress: () => void;
}) => {
  const Colors = useThemeColor();
  const scale = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1 : 0.8);
  }, [isSelected, scale]);

  const buttonColor: Color = useMemo(
    () => color ?? Colors.primaryColor,
    [Colors.primaryColor, color],
  );

  return (
    <TouchableOpacity onPress={!disabled && onPress} style={styles.container}>
      <View>
        {/* <Button
          iconName={iconName}
          // color={}
          disabled={disabled}
          onPress={onPress}
          width={size}
          style={{height: }}
          iconSize={size * 0.6}
        /> */}
        <Icon
          name={iconName}
          color={isSelected ? Colors.text : Colors.placeholderTextColor}
          size={size * 0.4}
        />
      </View>
      {indicator > 0 && (
        <Animated.View style={[styles.indicator]}>
          <NumberBubble
            number={indicator}
            color={buttonColor}
            isNeutralBackground={true}
          />
        </Animated.View>
      )}
      <ItemTitle
        title={title}
        style={{color: isSelected ? Colors.text : Colors.placeholderTextColor}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 2,
    gap: 2,
    marginBottom: 6,
  },
  indicator: {
    position: 'absolute',
    top: -5,
    right: -10,
  },
});

export default BarItem;
