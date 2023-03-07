import axios, { AxiosResponse } from "axios"

export const AuthUrl = import.meta.env.VITE_AUTH_URL ?? "http://localhost:4546";
export const HubUrl = import.meta.env.VITE_HUB_URL ?? "http://localhost:4545";

export const hubClient = axios.create({
  baseURL: HubUrl,
  timeout: 5000,
  headers: {}
});

export const authClient = axios.create({
  baseURL: AuthUrl,
  timeout: 5000,
  headers: {}
});

export type PostRequestType<T, V> = (body: T) => Promise<AxiosResponse<V>>;
export type GetRequestType<T> = (access?: string) => Promise<AxiosResponse<T>>;

export interface BaseType {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}

export * from './Auth';
export * from './Hub';
