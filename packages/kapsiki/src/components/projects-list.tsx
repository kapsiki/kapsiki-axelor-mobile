/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {
  NavigationObject,
  useNavigation,
  useSelector,
  useTranslator,
} from '@axelor/aos-mobile-core';
import {FunctionComponent, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {searchProjectApi} from '@axelor/aos-mobile-project';
import {useThemeColor} from '@axelor/aos-mobile-ui';

export type ProjectsListProps = {};

type RawProject = {
  id: number;
  name?: string | null;
  description?: string | null;
  isBusinessProject?: boolean;
  // allow other properties (we don't need them here)
  [k: string]: any;
};

type SearchAPIFunction<ReturnType, Payload = {}> = (
  searchPrams: {
    page: number;
    searchValue: string;
    companyId: number;
  } & Payload,
) => Promise<{data: {data: ReturnType[]}; status: number; total: number}>;

type SearchProjectAPIFunction = SearchAPIFunction<
  RawProject,
  {
    isBusinessProject: boolean;
    differentiateBusinessProjects: boolean;
  }
>;

export const ProjectsList: FunctionComponent<ProjectsListProps> = () => {
  const navigation = useNavigation() as NavigationObject;
  const I18n = useTranslator();
  const Colors = useThemeColor();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<RawProject[]>([]);
  const {user} = useSelector(state => state.user);

  const searchProjectAPI = useCallback(
    async (value: string = '') => {
      return await (searchProjectApi as SearchProjectAPIFunction)({
        page: 0,
        isBusinessProject: true,
        differentiateBusinessProjects: true,
        companyId: user.activeCompany?.id,
        searchValue: value,
      });
    },
    [user.activeCompany?.id],
  );

  useEffect(() => {
    (async () => {
      const _projects = await searchProjectAPI('');
      setIsLoading(false);
      setProjects(_projects.data.data);
    })();
  }, [searchProjectAPI]);

  return (
    <View
      style={{
        backgroundColor: Colors.backgroundColor,
      }}>
      <View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : projects.length > 0 ? (
          projects.slice(0, 6).map(project => (
            <TouchableOpacity
              key={project.id}
              style={{
                borderBottomColor: Colors.secondaryColor.background + '33',
                borderBottomWidth: 1,
                borderLeftColor: Colors.primaryColor.background,
                borderLeftWidth: 5,
                padding: 20,
              }}
              onPress={() => {
                navigation.navigate('ProjectDetailsScreen', {
                  projectId: project.id,
                });
              }}>
              <Text style={{fontSize: 12}}>
                {project.isBusinessProject ? (
                  <Text style={{fontSize: 12}}>
                    {I18n.t('business_project')}
                  </Text>
                ) : (
                  <Text style={{fontSize: 12}}>
                    {I18n.t('personal_project')}
                  </Text>
                )}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {project.name}
              </Text>
              <Text style={{fontSize: 16, paddingTop: 0, paddingBottom: 0}}>
                {project.description ? (
                  <Text style={{fontSize: 16}}>{project.description}</Text>
                ) : (
                  <Text style={{fontSize: 16}}>{I18n.t('no_description')}</Text>
                )}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No projects found</Text>
        )}
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            marginHorizontal: 'auto',
          }}
          onPress={() => {
            navigation.navigate('ProjectScreen');
          }}>
          <Text style={{fontSize: 16, textDecorationLine: 'underline'}}>
            {I18n.t('view_all_projects')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
