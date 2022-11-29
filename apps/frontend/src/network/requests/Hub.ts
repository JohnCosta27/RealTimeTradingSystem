import axios from "axios";
import { BaseType, GetRequestType, HubUrl, PostRequestType } from ".";

export interface Access {
  access: string;
}

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

export const GetUserAssets: GetRequestType<{ assets: GetUserAssets[] }> = (
  auth
) => {
  return axios.get(`${HubUrl}/users/assets`, {
    headers: {
      access: auth,
    },
  });
};

export const GetAllTrades: GetRequestType<{}> = (auth) => {
  return axios.get(`${HubUrl}/trade/`, {
    headers: {
      access: auth,
    }
  });
}

export interface PostCreateTransactionType {
  access: string;
  transactionBody: {
    assetId: string;
    type: "buy" | "sell";
    Amount: number;
    Price: number;
  };
}

export interface PostCreateTransactionRes {}

export const PostCreateTransaction: PostRequestType<
  PostCreateTransactionType,
  PostCreateTransactionRes
> = (body) => {
  return axios.post<PostCreateTransactionRes>(
    `${HubUrl}/trade/create`,
    body.transactionBody,
    {
      headers: {
        access: body.access,
      },
    }
  );
};
