import { AxiosResponse } from "axios"

export const AuthUrl = "http://localhost:4546";
export type RequestType<T, V> = (body: T) => Promise<AxiosResponse<V>>

export * from './Register';
