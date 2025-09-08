# (f-mgm-50-custom-home-screen): Implementation of a new module in the application (Kapsiki module) and creation of a home screen which replaces the one which was there

### Overview

This feature introduces the **Kapsiki module**, a new module integrated into the application. It provides a **custom home screen** that replaces the default one, giving users a tailored experience right after login.

The Kapsiki module is located in the `packages` folder, alongside the other application modules.

---

### Folder Structure

- **`src/screens`** – Contains all the screens of the Kapsiki module.
- **`src/views`** – Holds the different views associated with each screen.
- **`src/components`** – Contains reusable UI components specific to the Kapsiki module.
- **`src/i18n`** – Stores the translation dictionaries for internationalization.

---

### Components

- **`<Header />`**
  A custom header that can replace Axelor’s default header.

  - Props:

    - `title` _(string)_ – The title to display in the header.

- **`<HomeScreen />`**
  The main entry point for the Kapsiki module. It defines the **custom home screen** that is shown once the user logs in.

- **`<WelcomeHomeView />`**
  The first view displayed as a **dashboard**, providing a personalized welcome experience.
