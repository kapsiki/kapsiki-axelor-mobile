# (f-mgm-50-upcoming-events): Add Upcoming Events component and enhance localization for Kapsiki module

---

## `UpcomingEvents` Component

### Description

`UpcomingEvents` is a React Native functional component that displays a slider of upcoming calendar events. It shows events for **today**, **tomorrow**, and **future dates** in a visually organized manner, allowing users to quickly view scheduled events and navigate to an event creation screen.

---

### Props

```ts
export type UpcomingEventsProps = {};
```

- **Currently, this component does not take any props.**

---

### State

| State Variable  | Type                                                                                        | Description                                      |
| --------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `monthlyEvents` | `{ startDateTime: string; endDateTime: string; subject: string; [key: string]: string; }[]` | Stores all events fetched for the current month. |

---

### Hooks & Utilities

- **`useNavigation`**: Provides navigation capabilities to navigate to `EventFormScreen`.
- **`useTranslator`**: Provides translation functionality via `I18n.t`.
- **`useThemeColor`**: Retrieves theme colors for consistent styling.
- **`useMemo`**:

  - `today` and `tomorrow` dates.
  - Filtered arrays for `todayEvents`, `tomorrowEvents`, and `nextUpcomingEvents`.

- **`useEffect`**: Fetches monthly events for today using `getPlannedEvent`.

---

### Event Filtering Logic

- **Today’s Events**: Events whose `startDateTime` matches the current date.
- **Tomorrow’s Events**: Events whose `startDateTime` matches the next day.
- **Future Events**: Events whose `startDateTime` is after tomorrow.

---

### Rendered Structure

- **Top-level `View`**: Contains padding and vertical gap.

- **Header `Text`**: Displays localized title (`Upcoming Events`).

- **`Slider` Component**: Shows three slides:

  1. **Today**: Lists up to 3 events for today.
  2. **Tomorrow**: Lists up to 3 events for tomorrow.
  3. **Future**: Lists up to 3 events beyond tomorrow.

- **Event Item**:

  - Shows start and end times (or date for future events).
  - Displays the event subject.
  - Styled with colored border and background from theme.

- **Add Event Icon (`plus-circle`)**:

  - Touchable icon that navigates to `EventFormScreen` with the current date.

---

### Example Usage

```tsx
import {UpcomingEvents} from './UpcomingEvents';

export const DashboardScreen = () => {
  return (
    <View>
      <UpcomingEvents />
    </View>
  );
};
```

---

### Notes

- The component fetches **monthly events** once on mount for today’s date.
- It uses **theme colors** and **translations** for dynamic UI adaptation.
- Each slide uses the **same layout** but filters events based on the time period.
