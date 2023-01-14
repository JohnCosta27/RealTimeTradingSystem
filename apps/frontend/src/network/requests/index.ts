import { AxiosResponse } from "axios"

console.log(import.meta.env.VITE_HUB_URL);
export const AuthUrl = import.meta.env.VITE_AUTH_URL ?? "http://localhost:4546";
export const HubUrl = import.meta.env.VITE_HUB_URL ?? "http://localhost:4545";
console.log(HubUrl);

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
