import axios, { AxiosResponse } from 'axios';
import { isTokenValid } from './isAccessTokenValid';

export const AuthUrl = import.meta.env.VITE_AUTH_URL ?? 'http://localhost:4546';
export const HubUrl = import.meta.env.VITE_HUB_URL ?? 'http://localhost:4545';

export const hubClient = axios.create({
  baseURL: HubUrl,
  timeout: 5000,
  headers: {},
});

export async function getNewAccess(): Promise<string | undefined> {
  if (!isTokenValid('refresh')) return undefined;

  const newToken = await authClient.post<{ access: string }>('/refresh', {
    refresh: localStorage.getItem('refresh'),
  });

  if (newToken.status !== 200) return undefined;
  return newToken.data.access;
}

hubClient.interceptors.request.use(
  async (config) => {
    // Check there is a valid token, otherwise we need to get a new one.
    if (isTokenValid('access')) {
      config.headers!['access'] = localStorage.getItem('access');
    } else if (isTokenValid('refresh')) {
      // If the refresh token is valid, we could just have an expired access token.

      const newAccess = await getNewAccess();

      if (newAccess) {
        config.headers!['access'] = newAccess;
        localStorage.setItem('access', newAccess);
      } else {
        throw new axios.Cancel('User is not authenticated');
      }
    }

    return config;
  },
  (e) => Promise.reject(e),
);

export const authClient = axios.create({
  baseURL: AuthUrl,
  timeout: 5000,
  headers: {},
});

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
