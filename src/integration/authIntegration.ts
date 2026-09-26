import axios from 'axios';

const DEFAULT_AUTH_API_URL = 'https://login-p26w.onrender.com/fatec/login';

export const AUTH_API_URL =
  process.env.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/$/, '') ||
  DEFAULT_AUTH_API_URL;

// O cookie da sessao e HttpOnly: o aplicativo nunca recebe nem armazena o JWT.
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
});

export type RegisterAuthUserInput = {
  username: string;
  password: string;
  email: string;
};

export type RegisteredAuthUser = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

export type AuthenticatedUser = {
  userId: string;
  username: string;
  roles: string[];
};

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<AuthenticatedUser>;
  return (
    typeof user.userId === 'string' &&
    Boolean(user.userId.trim()) &&
    typeof user.username === 'string' &&
    Boolean(user.username.trim()) &&
    Array.isArray(user.roles)
  );
}

export async function loginAuthUser(username: string, password: string) {
  const response = await authApi.post<AuthenticatedUser>('/v1/auth', {
    username,
    password,
  });

  if (!isAuthenticatedUser(response.data)) {
    throw new Error('A API retornou uma sessao invalida.');
  }

  return response.data;
}

export async function registerAuthUser(
  input: RegisterAuthUserInput
): Promise<RegisteredAuthUser> {
  const response = await authApi.post<RegisteredAuthUser>('/v1/create', input);

  return response.data;
}

export async function logoutAuthUser() {
  await authApi.post('/v1/auth/logout');
}
