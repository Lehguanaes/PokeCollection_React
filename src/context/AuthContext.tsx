import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  createPokemonProfile,
  getPokemonProfileId,
} from '@/integration/collectionApi';
import {
  decodeAuthToken,
  isAuthTokenValid,
  loginAuthUser,
  logoutAuthUser,
  RegisterAuthUserInput,
  registerAuthUser,
  setAuthApiToken,
} from '@/integration/authIntegration';

type AuthSession = {
  token: string;
  username: string;
  roles: string[];
  expiresAt: number;
  pokemonUserId: string | null;
};

type PokemonProfileMode = 'login' | 'register';

type AuthContextData = {
  isAuthenticated: boolean;
  user: string | null;
  userId: string | null;
  token: string | null;
  roles: string[];
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (input: RegisterAuthUserInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AUTH_SESSION_KEY = '@Auth:session';
const POKEMON_PROFILE_IDS_KEY = '@Auth:pokemonProfileIds';
const AUTH_USER_KEY = '@Auth:user';
const AUTH_USER_ID_KEY = '@Auth:userId';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [storedSession, legacyUser, legacyUserId] = await Promise.all([
          AsyncStorage.getItem(AUTH_SESSION_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
          AsyncStorage.getItem(AUTH_USER_ID_KEY),
        ]);

        if (legacyUser && legacyUserId) {
          await storePokemonProfileId(legacyUser, legacyUserId);
        }

        await AsyncStorage.multiRemove([AUTH_USER_KEY, AUTH_USER_ID_KEY]);

        if (storedSession) {
          const parsed = JSON.parse(storedSession) as AuthSession;
          const claims = decodeAuthToken(parsed.token);

          if (
            isAuthTokenValid(parsed.token) &&
            parsed.username === claims.sub &&
            (typeof parsed.pokemonUserId === 'string' ||
              parsed.pokemonUserId === null)
          ) {
            setApiToken(parsed.token);
            setSession({
              ...parsed,
              roles: claims.roles,
              expiresAt: claims.exp * 1000,
            });
          } else {
            await AsyncStorage.removeItem(AUTH_SESSION_KEY);
          }
        }
      } catch {
        setApiToken(null);
        setSession(null);
        await AsyncStorage.removeItem(AUTH_SESSION_KEY).catch(() => undefined);
      } finally {
        setIsLoading(false);
      }
    }

    void loadStorageData();
  }, []);

  useEffect(() => {
    if (!session) return;

    const remainingTime = session.expiresAt - Date.now();

    if (remainingTime <= 0) {
      void clearSession();
      return;
    }

    const expirationTimer = setTimeout(() => {
      void clearSession();
    }, remainingTime);

    return () => clearTimeout(expirationTimer);
  }, [session?.expiresAt]);

  function setApiToken(token: string | null) {
    setAuthApiToken(token);
  }

  async function storePokemonProfileId(username: string, id: string) {
    let profileIds: Record<string, string> = {};

    try {
      const stored = await AsyncStorage.getItem(POKEMON_PROFILE_IDS_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      profileIds =
        parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          ? (parsed as Record<string, string>)
          : {};
    } catch {
      profileIds = {};
    }

    profileIds[username] = id;
    await AsyncStorage.setItem(
      POKEMON_PROFILE_IDS_KEY,
      JSON.stringify(profileIds)
    );
  }

  async function getStoredPokemonProfileId(username: string) {
    try {
      const stored = await AsyncStorage.getItem(POKEMON_PROFILE_IDS_KEY);
      if (!stored) return null;

      const profileIds = JSON.parse(stored) as Record<string, unknown>;
      return typeof profileIds[username] === 'string'
        ? profileIds[username]
        : null;
    } catch {
      return null;
    }
  }

  async function resolvePokemonProfileId(
    username: string,
    password: string,
    mode: PokemonProfileMode
  ) {
    const storedId = await getStoredPokemonProfileId(username);
    if (storedId) return storedId;

    if (mode === 'register') {
      try {
        const response = await createPokemonProfile(username, password);
        await storePokemonProfileId(username, response.userId);
        return response.userId;
      } catch (registerError) {
        const status = axios.isAxiosError(registerError)
          ? registerError.response?.status
          : undefined;

        if (status !== 400 && status !== 409) throw registerError;

        const response = await getPokemonProfileId(username, password);
        await storePokemonProfileId(username, response.userId);
        return response.userId;
      }
    }

    try {
      const response = await getPokemonProfileId(username, password);
      await storePokemonProfileId(username, response.userId);
      return response.userId;
    } catch (loginError) {
      const status = axios.isAxiosError(loginError)
        ? loginError.response?.status
        : undefined;

      if (status !== 401 && status !== 403 && status !== 404) throw loginError;

      const response = await createPokemonProfile(username, password);
      await storePokemonProfileId(username, response.userId);
      return response.userId;
    }
  }

  async function persistSession(
    token: string,
    pokemonUserId: string | null
  ) {
    const claims = decodeAuthToken(token);

    const nextSession: AuthSession = {
      token,
      username: claims.sub,
      roles: claims.roles,
      expiresAt: claims.exp * 1000,
      pokemonUserId,
    };

    setApiToken(token);
    setSession(nextSession);
    await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
  }

  async function signIn(username: string, password: string) {
    const response = await loginAuthUser(username, password);
    let pokemonUserId: string | null = null;

    try {
      pokemonUserId = await resolvePokemonProfileId(
        username,
        password,
        'login'
      );
    } catch (error) {
      console.warn(
        'Login autenticado; o perfil Pokemon esta temporariamente indisponivel.',
        error
      );
    }

    await persistSession(response.token, pokemonUserId);
  }

  async function signUp(input: RegisterAuthUserInput) {
    await registerAuthUser(input);
    let pokemonUserId: string | null = null;

    try {
      pokemonUserId = await resolvePokemonProfileId(
        input.username,
        input.password,
        'register'
      );
    } catch (error) {
      console.warn(
        'Conta autenticada criada; o perfil Pokemon sera vinculado quando o servico voltar a responder.',
        error
      );
    }

    const response = await loginAuthUser(input.username, input.password);

    await persistSession(response.token, pokemonUserId);
  }

  async function clearSession() {
    setApiToken(null);
    setSession(null);
    await AsyncStorage.removeItem(AUTH_SESSION_KEY).catch((error) => {
      console.warn('Nao foi possivel remover a sessao armazenada.', error);
    });
  }

  async function signOut() {
    const currentToken = session?.token;
    await clearSession();

    if (currentToken) {
      try {
        await logoutAuthUser(currentToken);
      } catch (error) {
        console.warn('Sessao local encerrada; a API de logout nao respondeu.', error);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session),
        user: session?.username ?? null,
        userId: session?.pokemonUserId ?? null,
        token: session?.token ?? null,
        roles: session?.roles ?? [],
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
