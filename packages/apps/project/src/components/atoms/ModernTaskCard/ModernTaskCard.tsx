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

import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Badge, Button, Text} from 'react-native-paper';
import {
  Icon,
  Card,
  ObjectCard,
  ProgressBar,
  useThemeColor,
  ModernObjectCard,
} from '@axelor/aos-mobile-ui';
import {
  DateDisplay,
  useTypeHelpers,
  useSelector,
} from '@axelor/aos-mobile-core';

interface TaskCardProps {
  style?: any;
  name?: string;
  assignedTo?: string;
  taskDeadline?: string;
  parentTask?: string;
  progress?: number;
  priority?: any;
  status?: any;
  isCopyCard?: boolean;
  showArrow?: boolean;
  onPress?: () => void;
}

const AtomTaskCard = ({
  style,
  name,
  assignedTo,
  taskDeadline,
  parentTask,
  progress,
  priority,
  status,
  isCopyCard = false,
  showArrow = false,
  onPress,
}: TaskCardProps) => {
  const {getItemColorFromIndex} = useTypeHelpers();
  const Colors = useThemeColor();

  const {projectTaskStatusList, projectPriorityList} = useSelector(
    (state: any) => state.project_projectTask,
  );

  const borderStyle = useMemo(() => {
    return (
      status != null &&
      getStyles(
        getItemColorFromIndex(projectTaskStatusList, status)?.background,
      )?.border
    );
  }, [status, getItemColorFromIndex, projectTaskStatusList]);

  return (
    <ModernObjectCard
      onPress={onPress}
      style={[borderStyle, styles.card, style]}
      iconLeftMargin={30}
      leftContainerFlex={2}
      showArrow={showArrow}
      upperTexts={{
        items: [
          {
            displayText: name,
            isTitle: true,
            style: {marginBottom: 10,},
          },
          /*
         {
            indicatorText: assignedTo,
            hideIfNull: true,
            iconName: 'pin-angle-fill',
          },
          */
          {
            customComponent: (
              <>
                <Text style={styles.assignedTo}>
                  <Icon name="person-fill" size={15} style={{marginRight: 5}} />
                  {assignedTo}
                </Text>
              </>
            ),
          },
        ],
      }}
      sideBadges={{
        style: isCopyCard && styles.badge,
        items: [
          /*
          {
            customComponent: <DateDisplay date={taskDeadline} size={16} />,
          },
          */
          {
            displayText: priority?.name,
            color: getItemColorFromIndex(projectPriorityList, priority),
            showIf: priority != null,
            style: {marginBottom: 10,},
            /*
            customComponent: (
              <ProgressBar
                style={styles.progressBar}
                value={progress}
                showPercent={false}
                height={15}
                styleTxt={styles.textProgressBar}
              />
            ),
            */
          },
          {
            customComponent: (
              <>
                <Text style={styles.parentTask}>
                  <Icon name="folder2-open" size={15} style={{marginRight: 5}} />
                  {parentTask}
                </Text>
              </>
            ),
          },
          isCopyCard && {
            customComponent: (
              <Icon name="copy" color={Colors.secondaryColor.background} />
            ),
          },
        ],
      }}
    />
  );
};

const Colors = useThemeColor();

const getStyles = color =>
  StyleSheet.create({
    border: {
      //borderLeftWidth: 7,
      //borderLeftColor: color,
    },
  });

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 2,
    marginVertical: 2,
    padding: 0,
    marginRight: 5,
    paddingRight: 5,
    flex: 1,
  },
  progressBar: {
    borderRadius: 20,
    marginVertical: 5,
  },
  textProgressBar: {
    display: 'none',
  },
  badge: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
  },
  assignedTo: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(147,143,153,1)',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 3,
    overflow: 'hidden',
    elevation: 0,
    justifyContent: 'center',
    minWidth: 100,
    //textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    marginHorizontal: 2,
    flex: 1,
    flexDirection: 'row',
    color: Colors.text,
  },
  parentTask: {
    overflow: 'hidden',
    elevation: 0,
    justifyContent: 'center',
    //minWidth: 200,
    //textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    //marginHorizontal: 2,
    flex: 3,
    //flexDirection: 'column',
    color: Colors.text,
  },
});

export default AtomTaskCard;
