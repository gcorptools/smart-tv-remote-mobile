import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  LinkingOptions,
} from '@react-navigation/native';

import {ColorSchemeName, Text} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../../constants';
import ConnectScreen from '../../screens/connect.screen';
import RemoteControlScreen from '../../screens/remote-control.screen';
import NotFoundScreen from '../../screens/not-found.screen';
import StoredDevicesScreen from '../../screens/stored-devices.screen';

const linking: LinkingOptions<any> = {
  prefixes: [],
  config: {
    screens: {
      Connect: ROUTES.Connect,
      RemoteControl: ROUTES.RemoteControl,
      NotFound: '*',
    },
  },
};

const Stack = createNativeStackNavigator();

const Navigation = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<Text>Loading...</Text>}
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? route?.name} - Smart TV App`,
      }}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        initialRouteName={ROUTES.StoredDevices}
        screenOptions={{headerShown: true}}>
        <Stack.Screen
          name={ROUTES.StoredDevices}
          component={StoredDevicesScreen}
          options={{title: 'Stored Devices'}}
        />
        <Stack.Screen
          name={ROUTES.Connect}
          component={ConnectScreen}
          options={{title: 'Smart TV parameters'}}
        />
        <Stack.Screen
          name={ROUTES.RemoteControl}
          component={RemoteControlScreen}
          options={{title: 'Remote Control'}}
        />
        <Stack.Screen
          name={ROUTES.NotFound}
          component={NotFoundScreen}
          options={{title: 'Oops!'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
