import axios from "axios";
import { BaseType, GetRequestType, HubUrl } from ".";

export interface GetAssets extends BaseType {
  Name: string;
}

export interface GetUserAssets extends BaseType {
  Amount: number;
  Asset: GetAssets;
}


export const GetAssets: GetRequestType<{ assets: GetAssets[] }> = (auth) => {
  return axios.get(`${HubUrl}/assets/`, {
    headers: {
      access: auth,
    },
  });
};

export const GetUserAssets: GetRequestType<{ assets: GetUserAssets[] }> = (auth) => {
  return axios.get(`${HubUrl}/users/assets`, {
    headers: {
      access: auth,
    },
  });
}
