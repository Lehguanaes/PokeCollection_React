import axios from 'axios';

const DEFAULT_AUTH_API_URL = 'http://localhost:8082/fatec/login';

export const AUTH_API_URL =
  process.env.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/$/, '') ||
  DEFAULT_AUTH_API_URL;

const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

export type AuthTokenResponse = {
  token: string;
};

export type RegisterAuthUserInput = {
  username: string;
  password: string;
  email: string;
  cep: string;
};

export type RegisteredAuthUser = {
  id: string;
  username: string;
  email: string;
  cep: string;
  roles: string[];
};

export type AuthTokenClaims = {
  sub: string;
  roles: string[];
  exp: number;
  iat?: number;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '='
  );
  const decoded = atob(padded);
  const encoded = Array.from(decoded)
    .map((character) =>
      `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`
    )
    .join('');

  return decodeURIComponent(encoded);
}

export function decodeAuthToken(token: string): AuthTokenClaims {
  const parts = token.split('.');
  const payload = parts[1];

  if (parts.length !== 3 || !payload) {
    throw new Error('Token de autenticacao invalido.');
  }

  const claims = JSON.parse(decodeBase64Url(payload)) as Partial<AuthTokenClaims>;

  if (
    typeof claims.sub !== 'string' ||
    !claims.sub.trim() ||
    typeof claims.exp !== 'number' ||
    !Number.isFinite(claims.exp)
  ) {
    throw new Error('Token de autenticacao sem os dados obrigatorios.');
  }

  return {
    sub: claims.sub,
    exp: claims.exp,
    iat: typeof claims.iat === 'number' ? claims.iat : undefined,
    roles: Array.isArray(claims.roles)
      ? claims.roles.filter((role): role is string => typeof role === 'string')
      : [],
  };
}

export function isAuthTokenValid(token: string, now = Date.now()) {
  try {
    return decodeAuthToken(token).exp * 1000 > now;
  } catch {
    return false;
  }
}

export function setAuthApiToken(token: string | null) {
  if (token) {
    authApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete authApi.defaults.headers.common.Authorization;
}

export async function loginAuthUser(
  username: string,
  password: string
): Promise<AuthTokenResponse> {
  const response = await authApi.post<AuthTokenResponse>('/v1/auth', {
    username,
    password,
  });

  if (!response.data?.token || !isAuthTokenValid(response.data.token)) {
    throw new Error('A API retornou um token de autenticacao invalido.');
  }

  return response.data;
}

export async function registerAuthUser(
  input: RegisterAuthUserInput
): Promise<RegisteredAuthUser> {
  const response = await authApi.post<RegisteredAuthUser>('/v1/user/save', {
    ...input,
    roles: ['USER'],
  });

  return response.data;
}

export async function logoutAuthUser(token: string) {
  await authApi.post(
    '/v1/auth/logout',
    undefined,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
