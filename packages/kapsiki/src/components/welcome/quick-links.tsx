/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  NavigationObject,
  storage,
  useNavigation,
  useTranslator,
} from '@axelor/aos-mobile-core';
import {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {FlatList, Modal, Text, TouchableOpacity, View} from 'react-native';
import {Icon, useThemeColor} from '@axelor/aos-mobile-ui';

export type QuickLinksProps = {};

type QuickLink = {
  title: string;
  screenName: string;
  icon: string;
};

export const QuickLinks: FunctionComponent<QuickLinksProps> = () => {
  const LINKS = useMemo<QuickLink[]>(() => {
    return [
      {
        title: 'Projects',
        screenName: 'ProjectScreen',
        icon: 'clipboard2-check',
      },
      {
        title: 'Business projects',
        screenName: 'BuisnessProjectScreen',
        icon: 'building-check',
      },
      {
        title: 'Active projects',
        screenName: 'ActiveProjectScreen',
        icon: 'clipboard2-check',
      },
      {
        title: 'Documents',
        screenName: 'AllDocumentsScreen',
        icon: 'file-earmark',
      },
      {
        title: 'Leads',
        screenName: 'LeadListScreen',
        icon: 'people',
      },
      {
        title: 'Prospects',
        screenName: 'ProspectsListScreen',
        icon: 'person-check',
      },
      {
        title: 'Opportunities',
        screenName: 'OpportunityListScreen',
        icon: 'search-dollar',
      },
      {
        title: 'Tours',
        screenName: 'TourListScreen',
        icon: 'globe-europe-africa',
      },
      {
        title: 'Contacts',
        screenName: 'ContactListScreen',
        icon: 'people',
      },
      {
        title: 'Clients',
        screenName: 'ClientsListScreen',
        icon: 'people',
      },
      {
        title: 'Events',
        screenName: 'EventPlanningScreen',
        icon: 'calendar-date',
      },
      {
        title: 'Expense lines',
        screenName: 'ExpenseLinesListScreen',
        icon: 'receipt',
      },
      {
        title: 'Expenses',
        screenName: 'ExpenseListScreen',
        icon: 'cash-coin',
      },
      {
        title: 'Requests',
        screenName: 'RequestListScreen',
        icon: 'inboxes',
      },
      {
        title: 'Suppliers arrivals',
        screenName: 'SupplierArrivalListScreen',
        icon: 'truck',
      },
      {
        title: 'Customer deliveries',
        screenName: 'CustomerDeliveryListScreen',
        icon: 'box-seam',
      },
      {
        title: 'Internal moves',
        screenName: 'InternalMoveListScreen',
        icon: 'arrows-move',
      },
      {
        title: 'Inventories',
        screenName: 'InventoryListScreen',
        icon: 'boxes',
      },
      {
        title: 'Products',
        screenName: 'ProductListScreen',
        icon: 'box',
      },
      {
        title: 'Product variants',
        screenName: 'ProductListVariantScreen',
        icon: 'boxes',
      },
      {
        title: 'Sales',
        screenName: 'ProductSaleListScreen',
        icon: 'cart4',
      },
      {
        title: 'Stock corrections',
        screenName: 'StockCorrectionListScreen',
        icon: 'journal-minus',
      },
      {
        title: 'Manufacturing orders',
        screenName: 'ManufacturingOrderListScreen',
        icon: 'gear',
      },
      {
        title: 'Consumed products',
        screenName: 'ConsumedProductListScreen',
        icon: 'arrow-down-circle',
      },
      {
        title: 'Produced products',
        screenName: 'ProducedProductListScreen',
        icon: 'arrow-up-circle',
      },
      {
        title: 'Waste products',
        screenName: 'WasteProductListScreen',
        icon: 'trash',
      },
      {
        title: 'Operation orders',
        screenName: 'OperationOrderListScreen',
        icon: 'clipboard',
      },
      {
        title: 'Tasks',
        screenName: 'TaskListScreen',
        icon: 'list-task',
      },
      {
        title: 'Timesheets',
        screenName: 'TimesheetListScreen',
        icon: 'clock-history',
      },
      {
        title: 'Timers',
        screenName: 'TimerListScreen',
        icon: 'stopwatch',
      },
      {
        title: 'Leaves',
        screenName: 'LeaveListScreen',
        icon: 'calendar-x',
      },
      {
        title: 'Interventions',
        screenName: 'DayInterventionsScreen',
        icon: 'hammer',
      },
      {
        title: 'Interventions history',
        screenName: 'InterventionsHistoryScreen',
        icon: 'book',
      },
      {
        title: 'Planned interventions',
        screenName: 'PlannedInterventionsScreen',
        icon: 'calendar-event',
      },
      {
        title: 'Quality improvements',
        screenName: 'QualityImprovementListScreen',
        icon: 'patch-check',
      },
      {
        title: 'Equipment',
        screenName: 'EquipmentLineListScreen',
        icon: 'tools',
      },
      {
        title: 'Equipment interventions',
        screenName: 'EquipmentInterventionListScreen',
        icon: 'screwdriver',
      },
    ];
  }, []);
  const navigation = useNavigation() as NavigationObject;
  const I18n = useTranslator();
  const Colors = useThemeColor();
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [defaultQuickLinks, setDefaultQuickLinks] = useState<QuickLink[]>([]);
  const [quickLinksModalVisible, setQuickLinksModalVisible] = useState(false);
  useEffect(() => {
    const DEFAULT_INDEXES = [1, 3, 10, 13];
    try {
      const storedQuickLinks = (storage.getItem('quickLinks') as string) || '';
      const parsedQuickLinks = JSON.parse(storedQuickLinks) as number[];
      setQuickLinks(
        LINKS.filter(
          (_, index) =>
            parsedQuickLinks.includes(index) || DEFAULT_INDEXES.includes(index),
        ),
      );
      setDefaultQuickLinks(
        LINKS.filter(
          (_, index) =>
            parsedQuickLinks.includes(index) || DEFAULT_INDEXES.includes(index),
        ),
      );
    } catch (error) {
      setQuickLinks(
        LINKS.filter((_, index) => DEFAULT_INDEXES.includes(index)),
      );
      setDefaultQuickLinks(
        LINKS.filter((_, index) => DEFAULT_INDEXES.includes(index)),
      );
    }
  }, [LINKS]);
  useEffect(() => {
    storage.setItem(
      'quickLinks',
      JSON.stringify(quickLinks.map((_l, index) => index)),
    );
  }, [quickLinks]);
  return (
    <View style={{gap: 20}}>
      <View
        style={{
          gap: 10,
          paddingHorizontal: 20,
          paddingBottom: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>
          {I18n.t('QuickLinks')}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setQuickLinksModalVisible(true);
          }}>
          <Text style={{textDecorationLine: 'underline', fontSize: 14}}>
            {I18n.t('Update')}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={quickLinks}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              // paddingVertical: 20,
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
              borderRadius: 12,
              // overflow: 'hidden',
              gap: 20,
              height: 56,
              backgroundColor: Colors.backgroundColor,
              margin: 10,
            }}
            onPress={() => {
              navigation.navigate(item.screenName);
            }}>
            <Icon
              name={item.icon}
              size={20}
              color={Colors.placeholderTextColor}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{fontSize: 14, fontWeight: 'bold'}}>
              {item.title.length > 11
                ? item.title.substring(0, 11) + '...'
                : item.title}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{padding: 10, paddingVertical: 0}}
      />
      <Modal
        visible={quickLinksModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQuickLinksModalVisible(false)}>
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
              maxHeight: '90%',
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
                {I18n.t('UpdateQuickLinks')}
              </Text>
              <TouchableOpacity
                onPress={() => setQuickLinksModalVisible(false)}
                style={{
                  padding: 8,
                }}>
                <Icon name="x" size={24} color={Colors.placeholderTextColor} />
              </TouchableOpacity>
            </View>

            <FlatList
              // sort links by putting the ones that are already in the quickLinks state at the top
              data={LINKS.sort((a, b) => {
                if (quickLinks.includes(a)) {
                  return -1;
                } else if (quickLinks.includes(b)) {
                  return 1;
                } else {
                  return 0;
                }
              })}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 20,
                    borderColor: quickLinks.includes(item)
                      ? Colors.primaryColor.background
                      : Colors.screenBackgroundColor,
                    borderWidth: 1,
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderRadius: 12,
                    // overflow: 'hidden',
                    gap: 20,
                    height: 56,
                    backgroundColor: Colors.screenBackgroundColor,
                  }}
                  onPress={() => {
                    if (quickLinks.includes(item)) {
                      setQuickLinks(
                        quickLinks.filter(
                          link => link.screenName !== item.screenName,
                        ),
                      );
                    } else {
                      setQuickLinks(
                        quickLinks.concat(
                          LINKS.filter(
                            link => link.screenName === item.screenName,
                          ),
                        ),
                      );
                    }
                  }}>
                  <Icon
                    name={item.icon}
                    size={20}
                    color={Colors.placeholderTextColor}
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{fontSize: 14, fontWeight: 'bold'}}>
                    {item.title.length > 100
                      ? item.title.substring(0, 100) + '...'
                      : item.title}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{padding: 10, paddingVertical: 0, gap: 10}}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
                gap: 12,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setQuickLinks(defaultQuickLinks);
                  setQuickLinksModalVisible(false);
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
                  {I18n.t('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDefaultQuickLinks(quickLinks);
                  setQuickLinksModalVisible(false);
                }}
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
                  {I18n.t('save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
