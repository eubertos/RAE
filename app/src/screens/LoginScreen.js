import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const { token, username, login, register, logout } = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [message, setMessage] = useState('');

  const doLogin = async () => {
    try {
      await login(user, pass);
      setMessage('Logged in');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      setMessage('Login failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const doRegister = async () => {
    try {
      await register(user, pass);
      setMessage('Registered and logged in');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      setMessage('Register failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const doLogout = async () => {
    await logout();
    setMessage('Logged out');
    Haptics.selectionAsync();
  };

  return (
    <View style={styles.container}>
      {token ? (
        <View>
          <Text style={styles.info}>Logged in as {username}</Text>
          <Pressable style={styles.button} onPress={doLogout} accessibilityLabel="Logout">
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ width: '80%' }}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />
          <Pressable style={styles.button} onPress={doLogin} accessibilityLabel="Login">
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={doRegister} accessibilityLabel="Register">
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
      )}
      {message ? <Text style={styles.info}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  info: {
    textAlign: 'center',
    marginTop: 10,
  },
});
