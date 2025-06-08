import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import TaskScreen from './src/screens/TaskScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AppProvider } from './src/context/AppContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { PerformanceMonitor } from './src/components/PerformanceMonitor';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ErrorBoundary>
          <PerformanceMonitor>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Tasks" component={TaskScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </PerformanceMonitor>
        </ErrorBoundary>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
