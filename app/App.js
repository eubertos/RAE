import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Text, StyleSheet, Alert } from 'react-native';
import { tokens } from './theme';
import * as Updates from 'expo-updates';
import HomeScreen from './src/screens/HomeScreen';
import TaskScreen from './src/screens/TaskScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AppProvider } from './src/context/AppContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { PerformanceMonitor } from './src/components/PerformanceMonitor';

const Stack = createNativeStackNavigator();

export default function App() {
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setUpdating(true);
          await Updates.fetchUpdateAsync();
          setUpdating(false);
          Alert.alert('Update downloaded', 'Restart now to apply?', [
            { text: 'Later', style: 'cancel' },
            { text: 'Restart', onPress: () => Updates.reloadAsync() },
          ]);
        }
      } catch (e) {
        console.log('Update check failed', e);
      }
    }
    checkForUpdates();
  }, []);

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
      {updating && (
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.overlayBox}>
            <ActivityIndicator color={tokens.text.primary} size="large" />
            <Text style={styles.overlayText}>Applying update...</Text>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.overlay.backdrop,
  },
  overlayBox: {
    padding: 20,
    backgroundColor: tokens.bg.primary,
    borderRadius: 8,
  },
  overlayText: {
    color: tokens.text.primary,
    marginTop: 10,
  },
});
