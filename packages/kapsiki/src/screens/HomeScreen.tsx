import React from 'react';
import WelcomeHomeView from '../views/welcome-home-view';
import {TabNavigation} from '../components/tab-navigation';
import ProjectsHomeView from '../views/projects-home.view';

export default () => {
  return (
    <TabNavigation
      screens={[
        {screen: WelcomeHomeView, title: 'Home', icon: 'house-door'},
        {screen: ProjectsHomeView, title: 'Projects', icon: 'clipboard2-data'},
      ]}
    />
  );
};
