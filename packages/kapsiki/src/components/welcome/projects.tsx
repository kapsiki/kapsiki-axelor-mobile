/* eslint-disable react/react-in-jsx-scope */
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

export type ProjectsProps = {};

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

export const Projects: FunctionComponent<ProjectsProps> = () => {
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
        padding: 20,
        gap: 10,
        marginTop: 20,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 24,
          paddingBottom: 5,
          borderBottomColor: Colors.secondaryColor.background + '33',
          borderBottomWidth: 1,
        }}>
        {I18n.t('Projects')}{' '}
        <Text style={{fontWeight: 'normal', fontSize: 16}}>
          {projects.length.toString().padStart(2, '0')}
        </Text>
      </Text>
      <View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : projects.length > 0 ? (
          projects.slice(0, 3).map(project => (
            <TouchableOpacity
              key={project.id}
              style={{
                borderBottomColor: Colors.secondaryColor.background + '33',
                borderBottomWidth: 1,
                paddingBottom: 10,
                paddingTop: 15,
              }}
              onPress={() => {
                navigation.navigate('ProjectDetailsScreen', {
                  projectId: project.id,
                });
              }}>
              <Text
                style={{fontSize: 18, paddingBottom: 5, fontWeight: 'bold'}}>
                {project.name}
              </Text>
              <Text style={{fontSize: 16, paddingTop: 0, paddingBottom: 10}}>
                {project.description ? (
                  <Text style={{fontSize: 16}}>{project.description}</Text>
                ) : (
                  <Text style={{fontSize: 16}}>{I18n.t('no_description')}</Text>
                )}
              </Text>
              <Text style={{fontSize: 12, paddingTop: 10, paddingBottom: 10}}>
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
            </TouchableOpacity>
          ))
        ) : (
          <Text>No projects found</Text>
        )}
        <TouchableOpacity
          style={{
            paddingVertical: 10,
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
