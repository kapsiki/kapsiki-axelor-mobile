import React, {useState, useRef, useEffect, ReactNode} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';

const {width: screenWidth} = Dimensions.get('window');

type ScreenComponentProps = {
  isActive: boolean;
  tabIndex: number;
};

type Screen = {
  title: string;
  component: React.ComponentType<ScreenComponentProps> | ReactNode;
  icon?: ((isActive: boolean) => ReactNode) | ReactNode;
  header?: (() => ReactNode) | ReactNode;
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
  swipeThreshold?: number;
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
  swipeThreshold = screenWidth * 0.25,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const translateX = useRef(
    new Animated.Value(-initialTab * screenWidth),
  ).current;
  const gestureState = useRef({dx: 0, isGesturing: false}).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: -activeTab * screenWidth,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [activeTab, translateX]);

  // keep this typed to PanGestureHandlerGestureEvent for continuous updates
  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const {translationX} = event.nativeEvent;
    gestureState.dx = translationX;
    gestureState.isGesturing = true;
    translateX.setValue(-activeTab * screenWidth + translationX);
  };

  // onEnded / state-change callback receives a HandlerStateChangeEvent
  const handleGestureEnd = (event: HandlerStateChangeEvent<any>) => {
    // nativeEvent on state-change contains translationX/velocityX when gesture finishes
    const {translationX = gestureState.dx ?? 0, velocityX = 0} =
      event.nativeEvent as any;
    gestureState.isGesturing = false;

    let newTab = activeTab;

    if (Math.abs(translationX) > swipeThreshold || Math.abs(velocityX) > 500) {
      if (translationX > 0 && activeTab > 0) {
        newTab = activeTab - 1;
      } else if (translationX < 0 && activeTab < screens.length - 1) {
        newTab = activeTab + 1;
      }
    }

    setActiveTab(newTab);
  };

  const switchTab = (index: number) => {
    if (index >= 0 && index < screens.length && !gestureState.isGesturing) {
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

      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onEnded={handleGestureEnd}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-50, 50]}>
        <Animated.View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.screensContainer,
              {transform: [{translateX}], width: screenWidth * screens.length},
            ]}>
            {screens.map((screen, index) => (
              <View key={index} style={[styles.screen, {width: screenWidth}]}>
                {typeof screen.component === 'function'
                  ? // use JSX / createElement instead of calling the component as a function
                    React.createElement(
                      screen.component as React.ComponentType<ScreenComponentProps>,
                      {
                        isActive: index === activeTab,
                        tabIndex: index,
                      },
                    )
                  : // render a provided ReactNode
                    screen.component}
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>

      {renderTabBar()}
    </SafeAreaView>
  );
};

export default TabBarNavigator;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  contentContainer: {flex: 1, overflow: 'hidden'},
  screensContainer: {flexDirection: 'row', height: '100%'},
  screen: {flex: 1, backgroundColor: '#f5f5f5'},
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
