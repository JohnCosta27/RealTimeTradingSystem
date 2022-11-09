import axios  from "axios"
import { AuthUrl, RequestType } from './index';

export interface PostRegisterType {
  firstname: string;
  surname: string;
  email: string;
  password: string;
}

export interface PostLoginType {
  email: string;
  password: string;
}

export interface PostRefreshType {
  refresh: string;
}

export interface PostAuthResponse {
  status: string;
  access: string;
  refresh: string;
}

export interface PostRefreshRes {
  access: string;
}

export const PostRegister: RequestType<PostRegisterType, PostAuthResponse> = (body) => {
  return axios.post<PostAuthResponse>(`${AuthUrl}/register`, body)
}

export const PostLogin: RequestType<PostLoginType, PostAuthResponse> = (body) => {
  return axios.post<PostAuthResponse>(`${AuthUrl}/login`, body);
}

export const PostRefresh: RequestType<PostRefreshType, PostRefreshRes> = (body) => {
  return axios.post<PostRefreshRes>(`${AuthUrl}/refresh`, body);
}
