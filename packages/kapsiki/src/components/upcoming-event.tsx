/* eslint-disable react-native/no-inline-styles */
import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {Icon, useThemeColor} from '@axelor/aos-mobile-ui';
import {getPlannedEvent} from '@axelor/aos-mobile-crm';
import {
  useTranslator,
  NavigationObject,
  useNavigation,
} from '@axelor/aos-mobile-core';
import Slider from './slider';

export type UpcomingEventsProps = {};

export const UpcomingEvents: FunctionComponent<UpcomingEventsProps> = () => {
  const [monthlyEvents, setMonthlyEvents] = useState<
    {
      startDateTime: string;
      endDateTime: string;
      subject: string;
      [key: string]: string;
    }[]
  >([]);
  const navigation = useNavigation() as NavigationObject;
  // EventFormScreen
  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t;
  }, []);
  const todayEvents = useMemo(
    () =>
      monthlyEvents.filter(event => {
        const eventDate = new Date(event.startDateTime);
        return (
          eventDate.getDate() === today.getDate() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      }),
    [monthlyEvents, today],
  );
  const getNextDay = (date: Date): Date => {
    const t = new Date(date);
    t.setDate(t.getDate() + 1);
    return t;
  };
  const tomorrowEvents = useMemo(
    () =>
      monthlyEvents.filter(event => {
        const eventDate = new Date(event.startDateTime);
        return (
          eventDate.getDate() === tomorrow.getDate() &&
          eventDate.getMonth() === tomorrow.getMonth() &&
          eventDate.getFullYear() === tomorrow.getFullYear()
        );
      }),
    [monthlyEvents, tomorrow],
  );
  const nextUpcomingEvents = useMemo(
    () =>
      monthlyEvents.filter(event => {
        const eventDate = new Date(event.startDateTime);
        return eventDate > tomorrow;
      }),
    [monthlyEvents, tomorrow],
  );
  const Colors = useThemeColor();
  const I18n = useTranslator();
  useEffect(() => {
    (async () => {
      // get tomorrows util function
      const r = await (getPlannedEvent as any)({
        date: today,
      });
      setMonthlyEvents(r.data.data);
    })();
  }, [today]);
  return (
    <View style={{paddingVertical: 20, gap: 20}}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        {I18n.t('upcomingEvents')}
      </Text>

      <Slider
        buttonStyle={{
          backgroundColor: Colors.plannedColor.background,
          borderRadius: 50,
        }}
        buttonTextStyle={{
          color: Colors.plannedColor.foreground,
        }}
        slides={[
          <View
            style={{
              borderTopColor: Colors.plannedColor.background,
              borderTopWidth: 1,
              width: '100%',
              borderBottomColor: Colors.plannedColor.background,
              borderBottomWidth: 1,
            }}>
            <View
              style={{
                padding: 20,
                maxHeight: 250,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  height: '100%',
                }}>
                <View
                  style={{
                    gap: 10,
                    width: 100,
                    justifyContent: 'space-between',
                    height: '100%',
                    alignItems: 'flex-start',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'normal',
                      }}>
                      {I18n.t('today')}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {today.toLocaleDateString(undefined, {
                        weekday: 'long',
                      })}
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                      }}>
                      {today.getDate()}
                    </Text>
                  </View>
                  <Icon
                    name="plus-circle"
                    size={24}
                    color={Colors.text}
                    touchable
                    onPress={() =>
                      navigation.navigate('EventFormScreen', {
                        eventId: null,
                        date: today.toISOString(),
                      })
                    }
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    height: '100%',
                    paddingLeft: 20,
                    gap: 5,
                  }}>
                  {todayEvents.slice(0, 3).map((event, index) => (
                    <View
                      key={index}
                      style={{
                        // borderColor: Colors.plannedColor.background,
                        padding: 10,
                        borderLeftColor: Colors.primaryColor.background,
                        borderLeftWidth: 5,
                        backgroundColor: Colors.plannedColor.background,
                        height: 60,
                        justifyContent: 'center',
                        gap: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {new Date(event.startDateTime).toLocaleTimeString(
                          undefined,
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}{' '}
                        -{' '}
                        {new Date(event.endDateTime).toLocaleTimeString(
                          undefined,
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'normal',
                        }}>
                        {event.subject}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>,
          <View
            style={{
              borderTopColor: Colors.plannedColor.background,
              borderTopWidth: 1,
              width: '100%',
              borderBottomColor: Colors.plannedColor.background,
              borderBottomWidth: 1,
            }}>
            <View
              style={{
                padding: 20,
                maxHeight: 250,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  height: '100%',
                }}>
                <View
                  style={{
                    gap: 10,
                    width: 100,
                    justifyContent: 'space-between',
                    height: '100%',
                    alignItems: 'flex-start',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'normal',
                      }}>
                      {I18n.t('tomorrow')}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      {tomorrow.toLocaleDateString(undefined, {
                        weekday: 'long',
                      })}
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                      }}>
                      {tomorrow.getDate()}
                    </Text>
                  </View>
                  <Icon
                    name="plus-circle"
                    size={24}
                    color={Colors.text}
                    touchable
                    onPress={() =>
                      navigation.navigate('EventFormScreen', {
                        eventId: null,
                        date: today.toISOString(),
                      })
                    }
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    height: '100%',
                    paddingLeft: 20,
                    gap: 5,
                  }}>
                  {tomorrowEvents.slice(0, 3).map((event, index) => (
                    <View
                      key={index}
                      style={{
                        // borderColor: Colors.plannedColor.background,
                        padding: 10,
                        borderLeftColor: Colors.primaryColor.background,
                        borderLeftWidth: 5,
                        backgroundColor: Colors.plannedColor.background,
                        height: 60,
                        justifyContent: 'center',
                        gap: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {new Date(event.startDateTime).toLocaleTimeString(
                          undefined,
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}{' '}
                        -{' '}
                        {new Date(event.endDateTime).toLocaleTimeString(
                          undefined,
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'normal',
                        }}>
                        {event.subject}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>,
          <View
            style={{
              borderTopColor: Colors.plannedColor.background,
              borderTopWidth: 1,
              width: '100%',
              borderBottomColor: Colors.plannedColor.background,
              borderBottomWidth: 1,
            }}>
            <View
              style={{
                padding: 20,
                maxHeight: 250,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  height: '100%',
                }}>
                <View
                  style={{
                    gap: 10,
                    width: 100,
                    justifyContent: 'space-between',
                    height: '100%',
                    alignItems: 'flex-start',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'normal',
                      }}>
                      {I18n.t('future_events')}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}>
                      {I18n.t('from')}{' '}
                      {getNextDay(tomorrow).toLocaleDateString(undefined, {
                        weekday: 'long',
                      })}
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                      }}>
                      {getNextDay(tomorrow).getDate()}
                    </Text>
                  </View>
                  <Icon
                    name="plus-circle"
                    size={24}
                    color={Colors.text}
                    touchable
                    onPress={() =>
                      navigation.navigate('EventFormScreen', {
                        eventId: null,
                        date: today.toISOString(),
                      })
                    }
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    height: '100%',
                    paddingLeft: 20,
                    gap: 5,
                  }}>
                  {nextUpcomingEvents.slice(0, 3).map((event, index) => (
                    <View
                      key={index}
                      style={{
                        // borderColor: Colors.plannedColor.background,
                        padding: 10,
                        borderLeftColor: Colors.primaryColor.background,
                        borderLeftWidth: 5,
                        backgroundColor: Colors.plannedColor.background,
                        height: 60,
                        justifyContent: 'center',
                        gap: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        {new Date(event.startDateTime).toLocaleDateString(
                          undefined,
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          },
                        )}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'normal',
                        }}>
                        {event.subject}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>,
        ]}
      />
    </View>
  );
};
