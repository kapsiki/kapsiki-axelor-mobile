# (f-mgm-50-quick-links): Add Quick Links component and enhance localization for Kapsiki module

## Overview

This feature adds a new Quick Links component to the Kapsiki module's welcome screen and enhances the localization support with additional translations.

## Changes Made

### 1. Quick Links Component

- Added a new `QuickLinks` component that displays frequently accessed screens
- Implemented customizable quick links with persistent storage
- Added a modal interface for managing quick links
- Default quick links include:
  - Business Projects
  - Documents
  - Events
  - Requests

### 2. Localization Enhancements

Added new translations in both English and French for:

- Module navigation items
- Business entities
- System operations
- Quick links interface

### 3. UI/UX Features

- Grid layout for quick link buttons
- Icon-based navigation
- Truncated text for long titles
- Modal-based quick links management
- Persistence of user preferences

## Technical Implementation

### Component Structure

```tsx
type QuickLink = {
  title: string;
  screenName: string;
  icon: string;
};
```

### Storage

- Uses `@axelor/aos-mobile-core` storage system
- Stores quick link preferences as JSON
- Maintains default links if storage is empty

### Navigation

- Integrates with `NavigationObject` from `@axelor/aos-mobile-core`
- Direct navigation to target screens

## Usage

1. Quick links appear on the welcome screen
2. Click "Update" to modify quick links
3. Select/deselect items in the modal
4. Save changes to persist preferences

## Dependencies

- @axelor/aos-mobile-ui
- @axelor/aos-mobile-core
- React Native core components

## Related Files

- `/packages/kapsiki/src/components/quick-links.tsx`
- `/packages/kapsiki/src/i18n/en.json`
- `/packages/kapsiki/src/i18n/fr.json`
- `/packages/kapsiki/src/views/welcome-home-view.tsx`
