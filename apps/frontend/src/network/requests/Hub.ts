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

export interface GetTransaction extends BaseType {
  AssetId: string;
  BuyerId: string;
  SellerId: string;
  Price: number;
  Amount: number;
  State: "in-market" | "complete";
}

export interface GetUserType extends BaseType {
  Balance: number;
  BuyTransactions: GetTransaction[];
  SellTransactions: GetTransaction[];
  UserAssets: GetUserAssets[];
}

export const GetAssets: GetRequestType<{ assets: GetAssets[] }> = (auth) => {
  return axios.get(`${HubUrl}/assets`, {
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

export const GetAllTrades: GetRequestType<{ trades: GetTransaction[] }> = (
  auth
) => {
  return axios.get(`${HubUrl}/trade/`, {
    headers: {
      access: auth,
    },
  });
};

export const GetUser: GetRequestType<{user: GetUserType }> = (auth) => {
  return axios.get(`${HubUrl}/users/`, {
    headers: {
      access: auth,
    }
  })
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

export interface PostCompleteTransactionType {
  access: string;
  body: {
    TransactionId: string;
  };
}

export const PostCreateTransaction: PostRequestType<
  PostCreateTransactionType,
  GetTransaction
> = (body) => {
  return axios.post<GetTransaction>(
    `${HubUrl}/trade/create`,
    body.transactionBody,
    {
      headers: {
        access: body.access,
      },
    }
  );
};

export const PostCompleteTransaction: PostRequestType<
  PostCompleteTransactionType,
  GetTransaction
> = (body) => {
  return axios.post<GetTransaction>(`${HubUrl}/trade/complete`, body.body, {
    headers: {
      access: body.access,
    },
  });
};

