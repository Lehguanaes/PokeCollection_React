import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '@/integration/pokemonIntegration';

type AuthContextData = {
  isAuthenticated: boolean;
  user: string | null;
  userId: string | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AUTH_USER_KEY = '@Auth:user';
const AUTH_USER_ID_KEY = '@Auth:userId';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const [storageUser, storageUserId] = await Promise.all([
        AsyncStorage.getItem(AUTH_USER_KEY),
        AsyncStorage.getItem(AUTH_USER_ID_KEY),
      ]);

      if (storageUser && storageUserId) {
        setUser(storageUser);
        setUserId(storageUserId);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    }

    loadStorageData();
  }, []);

  async function persistSession(username: string, id: string) {
    setUser(username);
    setUserId(id);
    setIsAuthenticated(true);

    await Promise.all([
      AsyncStorage.setItem(AUTH_USER_KEY, username),
      AsyncStorage.setItem(AUTH_USER_ID_KEY, id),
    ]);
  }

  async function signIn(username: string, password: string) {
    const response = await loginUser(username, password);
    await persistSession(username, response.userId);
  }

  async function signUp(username: string, password: string) {
    const response = await registerUser(username, password);
    await persistSession(username, response.userId);
  }

  async function signOut() {
    setUser(null);
    setUserId(null);
    setIsAuthenticated(false);

    await Promise.all([
      AsyncStorage.removeItem(AUTH_USER_KEY),
      AsyncStorage.removeItem(AUTH_USER_ID_KEY),
    ]);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userId,
        signIn,
        signUp,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
