import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import { theme } from './src/constants/theme';

const Stack = createStackNavigator();

export const APP_VERSION = '1.0.0';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.frameBg },
          headerTintColor: theme.colors.ink,
          headerTitleStyle: { fontWeight: '800' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: `Ten Frame Math  v${APP_VERSION}` }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
