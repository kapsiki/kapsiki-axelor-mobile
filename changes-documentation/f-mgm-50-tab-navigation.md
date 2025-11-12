# (f-mgm-50-tab-navigation): Implement tab navigation and projects list components, enhance home screen layout

---

## `TabNavigation` Component

### Description

`TabNavigation` is a React Native functional component that provides a **slider-based tab navigation system**. It allows switching between multiple screens via a horizontal slider, combined with a bottom navigation bar displaying icons and titles for each tab.

---

### Props

```ts
export type TabNavigationProps = {
  screens: {
    screen: FunctionComponent<any>; // The component to render for the tab
    title: string; // Title to display in the bottom navigation
    icon: string; // Icon name for the bottom navigation
  }[];
  selectedScreenIndex?: number; // Optional initial selected tab index
};
```

---

### State

| State Variable      | Type     | Description                                   |
| ------------------- | -------- | --------------------------------------------- |
| `activeScreenIndex` | `number` | Tracks the currently active screen/tab index. |

---

### Hooks & Utilities

- **`useState`**: Manages the active tab index.
- **`useThemeColor`**: Provides themed colors for active/inactive tab styling.
- **`Slider`**: Displays the screens as horizontally swipeable slides.
- **`ScrollView`**: Wraps the slider to allow vertical scrolling if content exceeds screen height.

---

### Behavior

1. **Screen Slider**:

   - Displays each screen passed in `screens` prop.
   - Supports horizontal swipe navigation.
   - Updates `activeScreenIndex` on slide change.

2. **Bottom Navigation**:

   - Renders an icon and title for each screen.
   - Highlights the active tab using theme colors.
   - Tapping a bottom navigation button changes the active screen in the slider.

---

### Rendered Structure

```
<Screen>
  <ScrollView>
    <Slider>
      [Slide 1: screens[0].screen()]
      [Slide 2: screens[1].screen()]
      ...
    </Slider>
  </ScrollView>
  <View> // Bottom Navigation
    <TouchableOpacity> // Tab 1
      <Icon />
      <Text />
    </TouchableOpacity>
    <TouchableOpacity> // Tab 2
      <Icon />
      <Text />
    </TouchableOpacity>
    ...
  </View>
</Screen>
```

---

### Example Usage

```tsx
import {TabNavigation} from './TabNavigation';
import {HomeScreen, ProfileScreen, SettingsScreen} from './screens';

const tabs = [
  {screen: HomeScreen, title: 'Home', icon: 'home'},
  {screen: ProfileScreen, title: 'Profile', icon: 'user'},
  {screen: SettingsScreen, title: 'Settings', icon: 'settings'},
];

export const App = () => {
  return <TabNavigation screens={tabs} selectedScreenIndex={0} />;
};
```

---

### Notes

- `initialIndex` of the slider is set to `selectedScreenIndex` if provided.
- The bottom navigation dynamically updates based on the `screens` array.
- Active/inactive tab colors are derived from the theme (`useThemeColor`).
- Supports vertical scrolling via `ScrollView` for longer screen content.
