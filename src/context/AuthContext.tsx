import React, { createContext, useContext, useState } from 'react';
import {
  AuthenticatedUser,
  loginAuthUser,
  logoutAuthUser,
  RegisterAuthUserInput,
  registerAuthUser,
} from '@/integration/authIntegration';

type AuthSession = {
  userId: string;
  username: string;
  roles: string[];
};

type AuthContextData = {
  isAuthenticated: boolean;
  user: string | null;
  userId: string | null;
  roles: string[];
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (input: RegisterAuthUserInput) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading] = useState(false);

  function createSession(authenticatedUser: AuthenticatedUser): AuthSession {
    return {
      userId: authenticatedUser.userId,
      username: authenticatedUser.username,
      roles: authenticatedUser.roles,
    };
  }

  async function signIn(username: string, password: string) {
    const authenticatedUser = await loginAuthUser(username, password);
    setSession(createSession(authenticatedUser));
  }

  async function signUp(input: RegisterAuthUserInput) {
    await registerAuthUser(input);
    const authenticatedUser = await loginAuthUser(input.username, input.password);
    setSession(createSession(authenticatedUser));
  }

  async function signOut() {
    setSession(null);

    try {
      await logoutAuthUser();
    } catch {
      // A proxima verificacao de sessao confirma o estado definido pelo servidor.
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session),
        user: session?.username ?? null,
        userId: session?.userId ?? null,
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
