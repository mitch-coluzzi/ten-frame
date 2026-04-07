import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import StrategySelectScreen from './src/screens/StrategySelectScreen';
import SolveScreen from './src/screens/SolveScreen';
import ResultScreen from './src/screens/ResultScreen';
import SandboxScreen from './src/screens/SandboxScreen';
import { theme } from './src/constants/theme';

const Stack = createStackNavigator();

export const APP_VERSION = '1.4.0';

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
        <Stack.Screen
          name="StrategySelect"
          component={StrategySelectScreen}
          options={{ title: 'Pick a way' }}
        />
        <Stack.Screen
          name="Solve"
          component={SolveScreen}
          options={{ title: 'Solve it' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: 'Result', headerLeft: () => null }}
        />
        <Stack.Screen
          name="Sandbox"
          component={SandboxScreen}
          options={{ title: 'Free Play' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
