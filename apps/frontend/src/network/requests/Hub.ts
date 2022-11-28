import axios from "axios";
import { BaseType, GetRequestType, HubUrl } from ".";

export interface GetAssets extends BaseType {
  Name: string;
}

export const GetAssets: GetRequestType<{ assets: GetAssets[] }> = (auth) => {
  return axios.get(`${HubUrl}/assets/`, {
    headers: {
      access: auth,
    },
  });
};
