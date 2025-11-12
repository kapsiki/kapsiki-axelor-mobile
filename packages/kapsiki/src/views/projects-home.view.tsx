import React from 'react';
import {Header} from '../components/header';
import {useTranslator} from '@axelor/aos-mobile-core';
import {ProjectsList} from '../components/projects-list';
import {SearchButton} from '../components/search-button';
const ProjectsHomeView = () => {
  const I18n = useTranslator();
  return (
    <>
      <Header title={I18n.t('projects')} />
      <SearchButton />
      <ProjectsList />
    </>
  );
};

export default ProjectsHomeView;
