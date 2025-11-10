/* eslint-disable react-native/no-inline-styles */
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React from 'react';
import {
  downloadFileOnPhone,
  NavigationObject,
  useNavigation,
  useSelector,
  useTranslator,
} from '@axelor/aos-mobile-core';
import {searchProjectApi} from '@axelor/aos-mobile-project';
import {searchDocumentApi} from '@axelor/aos-mobile-dms';
import {
  searchLeads as searchLeadsApi,
  searchProspect as searchProspectApi,
  searchContact as searchContactApi,
  searchClient as searchClientApi,
} from '@axelor/aos-mobile-crm';
import {Icon, Screen, useThemeColor} from '@axelor/aos-mobile-ui';
import {debounceStartEnd} from '../functions/utils';

export type SearchScreenProps = {};

// Types
type RawProject = {
  id: number;
  name?: string | null;
  description?: string | null;
  isBusinessProject?: boolean;
  // allow other properties (we don't need them here)
  [k: string]: any;
};

type RawDocument = {
  id: number;
  fileName?: string | null;
  isDirectory?: boolean;
  // allow other properties (we don't need them here)
  [k: string]: any;
};

type RawLead = {
  id: number;
  simpleFullName: string;
  enterpriseName: string;
  // allow other properties (we don't need them here)
  [k: string]: any;
};

type RawContact = {
  id: number;
  simpleFullName: string;
  mainPartner: {
    fullName: string;
  };
  // allow other properties (we don't need them here)
  [k: string]: any;
};

type RawClient = {
  id: number;
  simpleFullName: string;
  'mainAddress.fullName': string;
  // allow other properties (we don't need them here)
  [k: string]: any;
};

type RawProspect = {
  id: number;
  simpleFullName: string;
  enterpriseName: string;
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

type SearchLeadAPIFunction = SearchAPIFunction<RawLead>;

type SearchProspectAPIFunction = SearchAPIFunction<RawProspect>;

type SearchContactAPIFunction = SearchAPIFunction<RawContact>;

type SearchClientAPIFunction = SearchAPIFunction<RawClient>;

type SearchDocumentAPIFunction = SearchAPIFunction<RawDocument>;

type SearchCategory =
  | 'projects'
  | 'documents'
  | 'leads'
  | 'prospects'
  | 'contacts'
  | 'clients';

type CategoryFilter = {
  [key in SearchCategory]: boolean;
};

export const SearchScreen: FunctionComponent<SearchScreenProps> = () => {
  const navigation = useNavigation() as NavigationObject;
  const {baseUrl, token, jsessionId} = useSelector(state => state.auth);
  const I18n = useTranslator();
  const Colors = useThemeColor();
  const [text, setText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter>({
    projects: true,
    documents: true,
    leads: true,
    prospects: true,
    contacts: true,
    clients: true,
  });
  const [responses, setResponses] =
    useState<Awaited<ReturnType<typeof searchInEvrything>>>();
  const {user} = useSelector(state => state.user);

  const typingDebouncedRef = useRef<ReturnType<
    typeof debounceStartEnd<(searchText: string) => Promise<void>>
  > | null>(null);

  const handleDownloadFile = useCallback(
    async (document: any) => {
      await downloadFileOnPhone(
        {fileName: document.fileName, id: document.id, isMetaFile: false},
        {baseUrl, token, jsessionId},
        I18n,
      );
    },
    [I18n, baseUrl, jsessionId, token],
  );

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

  const searchLeadAPI = useCallback(
    async (value: string = '') => {
      return await (searchLeadsApi as unknown as SearchLeadAPIFunction)({
        page: 0,
        searchValue: value,
        companyId: user.activeCompany?.id,
      });
    },
    [user.activeCompany?.id],
  );

  const searchProspectAPI = useCallback(
    async (value: string = '') => {
      return await (searchProspectApi as unknown as SearchProspectAPIFunction)({
        page: 0,
        searchValue: value,
        companyId: user.activeCompany?.id,
      });
    },
    [user.activeCompany?.id],
  );

  const searchContactAPI = useCallback(
    async (value: string = '') => {
      return await (searchContactApi as unknown as SearchContactAPIFunction)({
        page: 0,
        searchValue: value,
        companyId: user.activeCompany?.id,
      });
    },
    [user.activeCompany?.id],
  );

  const searchClientAPI = useCallback(
    async (value: string = '') => {
      return await (searchClientApi as unknown as SearchClientAPIFunction)({
        page: 0,
        searchValue: value,
        companyId: user.activeCompany?.id,
      });
    },
    [user.activeCompany?.id],
  );

  const searchDocumentAPI = useCallback(
    async (value: string = '') => {
      return await (searchDocumentApi as unknown as SearchDocumentAPIFunction)({
        page: 0,
        searchValue: value,
        companyId: user.activeCompany?.id,
      });
    },
    [user.activeCompany?.id],
  );

  const searchInEvrything = useCallback(
    async (value: string): Promise<Record<SearchCategory, any[]>> => {
      const results = {} as Record<SearchCategory, any[]>;

      if (categoryFilters.projects) {
        const projects = await searchProjectAPI(value);
        results.projects = projects.data.data;
      }

      if (categoryFilters.documents) {
        const documents = await searchDocumentAPI(value);
        results.documents = documents.data.data;
      }

      if (categoryFilters.leads) {
        const leads = await searchLeadAPI(value);
        results.leads = leads.data.data;
      }

      if (categoryFilters.prospects) {
        const prospects = await searchProspectAPI(value);
        results.prospects = prospects.data.data;
      }

      if (categoryFilters.contacts) {
        const contacts = await searchContactAPI(value);
        results.contacts = contacts.data.data;
      }

      if (categoryFilters.clients) {
        const clients = await searchClientAPI(value);
        results.clients = clients.data.data;
      }

      return results;
    },
    [
      searchProjectAPI,
      searchDocumentAPI,
      searchLeadAPI,
      categoryFilters,
      searchProspectAPI,
      searchContactAPI,
      searchClientAPI,
    ],
  );

  useEffect(() => {
    typingDebouncedRef.current = debounceStartEnd(
      async (searchText: string) => {
        setIsLoading(true);
        try {
          const results = await searchInEvrything(
            searchText
              .toString()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase(),
          );
          setResponses(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      },
      1000,
    );
  }, [searchInEvrything]);

  useEffect(() => {
    if (text.length > 0) {
      typingDebouncedRef.current(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilters]);

  const handleSearchTextChange = useCallback(
    async (_text: string) => {
      setText(_text);
      if (_text.length > 0) {
        if (showResults === false) {
          setShowResults(true);
        }
        await typingDebouncedRef.current(_text);
      } else {
        setShowResults(false);
        setResponses(undefined);
        setIsLoading(false);
      }
    },
    [showResults, typingDebouncedRef],
  );

  const handleClearSearch = useCallback(() => {
    // Do nothing if loading
    if (isLoading) {
      return;
    }

    setText('');
    setShowResults(false);
    setResponses(undefined);
  }, [isLoading]);

  const toggleCategoryFilter = useCallback((category: SearchCategory) => {
    setCategoryFilters(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(categoryFilters).filter(Boolean).length;
  }, [categoryFilters]);

  const hasActiveFilters = useCallback(() => {
    return getActiveFiltersCount() < 3;
  }, [getActiveFiltersCount]);

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <Screen
      removeSpaceOnTop={true}
      style={{
        width: '100%',
        padding: 0,
        paddingTop: 0,
        gap: 20,
        // position: 'relative',
        // zIndex: 1,
      }}>
      <View
        style={{
          margin: 0,
          flex: 1,
          backgroundColor: Colors.screenBackgroundColor,
        }}>
        <View
          style={{
            margin: 0,
            flex: 1,
            backgroundColor: Colors.screenBackgroundColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.backgroundColor,
              gap: 20,
              padding: 20,
              paddingRight: 5,
              paddingBottom: 5,
              paddingTop: 5,
            }}>
            <Icon
              name="arrow-left"
              size={26}
              color={Colors.primaryColor.background}
              touchable
              onPress={() => {
                navigation.goBack();
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.screenBackgroundColor,
                borderRadius: 12,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  paddingLeft: 20,
                  backgroundColor: Colors.screenBackgroundColor,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="search"
                  size={20}
                  color={Colors.placeholderTextColor}
                />
              </View>
              <TextInput
                placeholder={I18n.t('search_placeholder')}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                onFocus={() => {
                  setShowResults(true);
                }}
                style={{
                  backgroundColor: Colors.screenBackgroundColor,
                  color: Colors.text,
                  height: 56,
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  // paddingRight: 10,
                  fontSize: 16,
                }}
                value={text}
                onChangeText={handleSearchTextChange}
                placeholderTextColor={Colors.placeholderTextColor}
              />

              <TouchableOpacity
                onPress={() => setShowFilterModal(true)}
                style={{
                  backgroundColor: hasActiveFilters()
                    ? Colors.primaryColor + '20'
                    : Colors.placeholderTextColor + '20',
                  height: 56,
                  width: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                <Icon
                  name="filter"
                  size={20}
                  color={
                    hasActiveFilters()
                      ? Colors.primaryColor.background
                      : Colors.placeholderTextColor
                  }
                />
                {hasActiveFilters() && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: Colors.primaryColor.background,
                      borderRadius: 8,
                      minWidth: 16,
                      height: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}>
                      {getActiveFiltersCount()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {text.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearSearch}
                  disabled={isLoading}
                  style={{
                    backgroundColor: Colors.placeholderTextColor + '20',
                    height: 56,
                    width: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isLoading ? 0.7 : 1,
                  }}>
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.placeholderTextColor}
                    />
                  ) : (
                    <Icon
                      name="x"
                      size={20}
                      color={Colors.placeholderTextColor}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ScrollView
            style={{
              flex: 1,
              padding: 0,
              paddingHorizontal: 0,
            }}>
            {responses && Object.keys(responses).length > 0 && showResults && (
              <View
                style={{
                  width: '100%',
                  backgroundColor: Colors.backgroundColor,
                }}>
                {Object.entries(responses)
                  .filter(([_key, value]) => value && value.length > 0)
                  .map(([key, value]) => (
                    <View
                      style={{
                        borderTopWidth: 10,
                        borderTopColor: Colors.screenBackgroundColor,
                        width: '100%',
                      }}
                      key={key}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          padding: 20,
                          borderBottomColor: Colors.plannedColor.background,
                          borderBottomWidth: 1,
                          fontSize: 18,
                        }}>
                        {I18n.t(`search_${key}`)}
                      </Text>
                      {value
                        .filter(item =>
                          key === 'documents' ? !item.isDirectory : true,
                        )
                        .slice(0, 3)
                        .map(item => (
                          <TouchableOpacity
                            key={item.id}
                            onPress={async () => {
                              enum KeysRoutes {
                                leads = 'LeadDetailsScreen',
                                projects = 'ProjectDetailsScreen',
                                contacts = 'ContactDetailsScreen',
                                clients = 'ClientDetailsScreen',
                                prospects = 'ProspectDetailsScreen',
                              }
                              if (key === 'documents' && !item.isDirectory) {
                                setIsLoading(true);
                                await handleDownloadFile(item);
                                handleClearSearch();
                                setIsLoading(false);
                                return;
                              }
                              navigation.navigate(KeysRoutes[key], {
                                idLead: item.id,
                                projectId: item.id,
                                idContact: item.id,
                                idClient: item.id,
                                idProspect: item.id,
                              });
                            }}
                            style={{
                              padding: 20,
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.plannedColor.background,
                              borderLeftColor: Colors.primaryColor.background,
                              borderLeftWidth: 4,
                            }}>
                            <Text
                              style={{
                                fontWeight: 'bold',
                                marginBottom: 4,
                                fontSize: 16,
                              }}>
                              {item.simpleFullName ||
                                item.name ||
                                item.fileName}
                            </Text>

                            {item.description ? (
                              <Text style={{fontSize: 14}}>
                                {item.description}
                              </Text>
                            ) : key === 'projects' ? (
                              <Text style={{fontSize: 14}}>
                                {I18n.t('no_description')}
                              </Text>
                            ) : null}

                            {item.isDirectory ? (
                              <Text style={{fontSize: 14}}>
                                {I18n.t('folder')}
                              </Text>
                            ) : key === 'documents' ? (
                              <Text style={{fontSize: 14}}>
                                {I18n.t('no_folder')}
                              </Text>
                            ) : null}

                            {item.enterpriseName ? (
                              <Text style={{fontSize: 14}}>
                                {item.enterpriseName}
                              </Text>
                            ) : key === 'leads' ? (
                              <Text style={{fontSize: 14}}>
                                {I18n.t('no_enterprise')}
                              </Text>
                            ) : null}

                            {item.mainPartner && item.mainPartner.fullName ? (
                              <Text style={{fontSize: 14}}>
                                {item.mainPartner.fullName}
                              </Text>
                            ) : key === 'contacts' ? (
                              <Text style={{fontSize: 14}}>
                                {I18n.t('no_partner')}
                              </Text>
                            ) : null}

                            {item['mainAddress.fullName'] ? (
                              <Text style={{fontSize: 14}}>
                                {item['mainAddress.fullName']}
                              </Text>
                            ) : key === 'clients' ? (
                              <Text style={{fontSize: 14}}>
                                {I18n.t('no_address')}
                              </Text>
                            ) : null}
                          </TouchableOpacity>
                        ))}
                    </View>
                  ))}
                <View style={{height: 40}} />
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 400,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: Colors.text,
                }}>
                {I18n.t('filter_categories')}
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{
                  padding: 8,
                }}>
                <Icon name="x" size={24} color={Colors.placeholderTextColor} />
              </TouchableOpacity>
            </View>

            <View style={{gap: 16}}>
              {(
                [
                  'projects',
                  'documents',
                  'leads',
                  'prospects',
                  'contacts',
                  'clients',
                ] satisfies SearchCategory[]
              ).map(category => (
                <TouchableOpacity
                  key={category}
                  onPress={() => toggleCategoryFilter(category)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    backgroundColor: categoryFilters[category]
                      ? Colors.primaryColor.background + '10'
                      : Colors.placeholderTextColor + '10',
                    borderRadius: 12,
                    borderWidth: categoryFilters[category] ? 2 : 2,
                    borderColor: categoryFilters[category]
                      ? Colors.primaryColor.background
                      : Colors.placeholderTextColor + '30',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Icon
                      name={
                        category === 'projects'
                          ? 'briefcase'
                          : category === 'documents'
                            ? 'file-text'
                            : category === 'leads'
                              ? 'people'
                              : category === 'prospects'
                                ? 'person-check'
                                : category === 'contacts'
                                  ? 'people'
                                  : category === 'clients'
                                    ? 'people'
                                    : 'person'
                      }
                      size={20}
                      color={
                        categoryFilters[category]
                          ? Colors.primaryColor.background
                          : Colors.defaultColor.background
                      }
                      style={{marginRight: 12}}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: categoryFilters[category] ? 'bold' : 'bold',
                        color: categoryFilters[category]
                          ? Colors.primaryColor.background
                          : Colors.text,
                      }}>
                      {I18n.t(`search_${category}`)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: categoryFilters[category]
                        ? Colors.primaryColor.background
                        : Colors.placeholderTextColor,
                      backgroundColor: categoryFilters[category]
                        ? Colors.primaryColor.background
                        : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {categoryFilters[category] && (
                      <Icon name="check" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
                gap: 12,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setCategoryFilters({
                    projects: true,
                    documents: true,
                    leads: true,
                    prospects: true,
                    contacts: true,
                    clients: true,
                  });
                }}
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: Colors.placeholderTextColor + '20',
                  borderRadius: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: Colors.text,
                  }}>
                  {I18n.t('select_all')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: Colors.primaryColor.background,
                  borderRadius: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {I18n.t('apply_filters')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

export default SearchScreen;
