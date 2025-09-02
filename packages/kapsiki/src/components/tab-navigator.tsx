import React, {useState, ReactNode, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ScreenComponentProps = {
  isActive: boolean;
  tabIndex: number;
};

type Screen = {
  title: string;
  component: React.ComponentType<ScreenComponentProps>;
  icon?: (isActive: boolean) => ReactNode;
  header?: () => ReactNode;
  headerStyle?: ViewStyle;
};

type TabBarNavigatorProps = {
  screens: Screen[];
  initialTab?: number;
  tabBarStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  activeTabTextStyle?: TextStyle;
  headerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
};

export const TabBarNavigator: React.FC<TabBarNavigatorProps> = ({
  screens = [],
  initialTab = 0,
  tabBarStyle = {},
  tabStyle = {},
  activeTabStyle = {},
  tabTextStyle = {},
  activeTabTextStyle = {},
  headerStyle = {},
  containerStyle = {},
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const CurrenScreen = useMemo(() => {
    return screens[activeTab].component;
  }, [screens, activeTab]);
  const switchTab = (index: number) => {
    if (index >= 0 && index < screens.length) {
      setActiveTab(index);
    }
  };

  const renderTabBar = () => (
    <View style={[styles.tabBar, tabBarStyle]}>
      {screens.map((screen, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.tab,
            tabStyle,
            index === activeTab && {...styles.activeTab, ...activeTabStyle},
          ]}
          onPress={() => switchTab(index)}
          activeOpacity={0.7}>
          {screen.icon && (
            <View style={styles.tabIcon}>
              {typeof screen.icon === 'function'
                ? screen.icon(index === activeTab)
                : screen.icon}
            </View>
          )}
          <Text
            style={[
              styles.tabText,
              tabTextStyle,
              index === activeTab && {
                ...styles.activeTabText,
                ...activeTabTextStyle,
              },
            ]}>
            {screen.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHeader = () => {
    const currentScreen = screens[activeTab];
    if (!currentScreen?.header) return null;

    const defaultHeaderStyle: ViewStyle = {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      ...headerStyle,
    };

    return (
      <View style={[defaultHeaderStyle, currentScreen.headerStyle]}>
        {typeof currentScreen.header === 'function'
          ? currentScreen.header()
          : currentScreen.header}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      <CurrenScreen isActive tabIndex={activeTab} />
      {renderTabBar()}
    </SafeAreaView>
  );
};

export default TabBarNavigator;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  contentContainer: {flex: 1, overflow: 'hidden'},
  screensContainer: {flexDirection: 'row', height: '100%'},
  screen: {backgroundColor: '#f5f5f5'},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    minHeight: 60,
  },
  activeTab: {backgroundColor: '#e3f2fd'},
  tabIcon: {marginBottom: 4},
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {color: '#1976d2', fontWeight: '600'},
});
