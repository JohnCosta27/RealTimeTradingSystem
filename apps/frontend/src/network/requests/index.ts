import axios, { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { isTokenValid } from './isAccessTokenValid';

export const AuthUrl = import.meta.env.VITE_AUTH_URL ?? 'http://localhost:4546';
export const HubUrl = import.meta.env.VITE_HUB_URL ?? 'http://localhost:4545';

export interface Token {
  Uuid: string;
  Exp: string;
  Type: 'access' | 'refresh';
}

// Creates the axios clients to make it easier,
// to manage the requests to each service.

export const hubClient = axios.create({
  baseURL: HubUrl,
  timeout: 5000,
  headers: {},
});

export const authClient = axios.create({
  baseURL: AuthUrl,
  timeout: 5000,
  headers: {},
});

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem("access", access);
  if (refresh) {
    localStorage.setItem("refresh", refresh);
  }
}

/**
 * Gets the access token, even if it has to refetch it,
 * or if the authentication is invalid it returns undefined
  *
 * @returns the access token or undefined is unauthorized.
 */
export async function getNewAccess(): Promise<string | undefined> {
  if (!isTokenValid('refresh')) return undefined;
  if (isTokenValid('access')) return localStorage.getItem("access")!;

  const newToken = await authClient.post<{ access: string }>('/refresh', {
    refresh: localStorage.getItem('refresh'),
  });

  if (newToken.status !== 200) return undefined;
  return newToken.data.access;
}

/**
 * Returns the user ID from the JWT, or undefined if
 * for some reason the JWT is not valid.
 */
export function getUserId(): string | undefined {
  const token = localStorage.getItem('access');
  if (!token) return undefined;

  if (!isTokenValid('access')) return undefined;

  const decoded = jwtDecode(token) as Token;
  return decoded.Uuid;
}

hubClient.interceptors.request.use(
  async (config) => {
    const newAccess = await getNewAccess();

    if (newAccess) {
      config.headers!['access'] = newAccess;
    } else {
        throw new axios.Cancel('User is not authenticated');
    }

    return config;
  },
  (e) => Promise.reject(e),
);

export type PostRequestType<T, V> = (body: T) => Promise<AxiosResponse<V>>;
export type GetRequestType<T> = () => Promise<AxiosResponse<T>>;

export interface BaseType {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}

export * from './Auth';
export * from './Hub';
