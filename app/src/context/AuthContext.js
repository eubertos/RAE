import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://localhost:3001';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const load = async () => {
      const t = await AsyncStorage.getItem('authToken');
      const u = await AsyncStorage.getItem('authUser');
      if (t) setToken(t);
      if (u) setUsername(u);
    };
    load();
  }, []);

  const save = async (t, u) => {
    await AsyncStorage.setItem('authToken', t);
    await AsyncStorage.setItem('authUser', u);
  };

  const login = async (user, pass) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setToken(data.token);
    setUsername(user);
    save(data.token, user);
  };

  const register = async (user, pass) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });
    if (!res.ok) throw new Error('Register failed');
    await login(user, pass);
  };

  const logout = async () => {
    setToken(null);
    setUsername(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ token, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
