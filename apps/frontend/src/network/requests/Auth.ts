import { authClient, PostRequestType } from './index';

/**
 * Various requests and types for the authentication system.
 */

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

export const PostRegister: PostRequestType<PostRegisterType, PostAuthResponse> = (body) => {
  return authClient.post<PostAuthResponse>(`/register`, body)
}

export const PostLogin: PostRequestType<PostLoginType, PostAuthResponse> = (body) => {
  return authClient.post<PostAuthResponse>(`/login`, body);
}

export const PostRefresh: PostRequestType<PostRefreshType, PostRefreshRes> = (body) => {
  return authClient.post<PostRefreshRes>(`/refresh`, body);
}
