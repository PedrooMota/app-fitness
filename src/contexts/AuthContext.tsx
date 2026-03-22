import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import * as authApi from '../api/auth';
import * as usersApi from '../api/users';

interface AuthContextData {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isFirstLogin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    weight?: number;
    height?: number;
    age?: number;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  dismissWelcome: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const checkFirstLogin = async (me: User) => {
    if (me.role !== 'user') return;
    const seen = await AsyncStorage.getItem(`@welcomeSeen:${me.id}`);
    if (!seen) setIsFirstLogin(true);
  };

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('@token');
      if (token) {
        const me = await usersApi.getMe();
        setUser(me);
        await checkFirstLogin(me);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    await AsyncStorage.setItem('@token', res.access_token);
    const me = await usersApi.getMe();
    setUser(me);
    await checkFirstLogin(me);
  };

  const signUp = async (data: Parameters<typeof authApi.register>[0]) => {
    const res = await authApi.register(data);
    await AsyncStorage.setItem('@token', res.access_token);
    const me = await usersApi.getMe();
    setUser(me);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@token');
    setUser(null);
    setIsFirstLogin(false);
  };

  const refreshUser = async () => {
    const me = await usersApi.getMe();
    setUser(me);
  };

  const dismissWelcome = async () => {
    if (user) await AsyncStorage.setItem(`@welcomeSeen:${user.id}`, 'true');
    setIsFirstLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role ?? null, loading, isFirstLogin, signIn, signUp, signOut, refreshUser, dismissWelcome }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
