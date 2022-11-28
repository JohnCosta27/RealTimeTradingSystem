import { AxiosResponse } from "axios"

export const AuthUrl = "http://localhost:4546";
export const HubUrl = "http://localhost:4545";

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
