import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, StyleSheet, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import HomeScreen from './src/screens/HomeScreen';
import TaskScreen from './src/screens/TaskScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MentorScreen from './src/screens/MentorScreen';
import LoginScreen from './src/screens/LoginScreen';
import { AppProvider } from './src/context/AppContext';
import { MentorProvider } from './src/context/MentorContext';
import { AuthProvider } from './src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { PerformanceMonitor } from './src/components/PerformanceMonitor';

const Tab = createBottomTabNavigator();

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
      <AuthProvider>
        <AppProvider>
          <MentorProvider>
            <ErrorBoundary>
              <PerformanceMonitor>
                <NavigationContainer>
                  <Tab.Navigator
                    screenOptions={({ route }) => ({
                      tabBarIcon: ({ color, size }) => {
                        let icon = 'home';
                        if (route.name === 'Tasks') icon = 'checkbox';
                        if (route.name === 'Mentor') icon = 'chatbubble';
                        if (route.name === 'Profile') icon = 'person';
                        if (route.name === 'Account') icon = 'log-in';
                        return <Ionicons name={icon} size={size} color={color} />;
                      },
                    })}
                  >
                    <Tab.Screen name="Home" component={HomeScreen} />
                    <Tab.Screen name="Tasks" component={TaskScreen} />
                    <Tab.Screen name="Mentor" component={MentorScreen} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                    <Tab.Screen name="Account" component={LoginScreen} />
                  </Tab.Navigator>
                </NavigationContainer>
              </PerformanceMonitor>
            </ErrorBoundary>
          </MentorProvider>
        </AppProvider>
      </AuthProvider>
      {updating && (
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.overlayBox}>
            <ActivityIndicator color="#fff" size="large" />
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayBox: {
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  overlayText: {
    color: '#fff',
    marginTop: 10,
  },
});
