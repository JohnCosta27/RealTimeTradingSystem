import { BaseType, GetRequestType, hubClient, PostRequestType } from '.';

/**
 * Various requests and types for the Hub.
 */

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
  State: 'in-market' | 'complete';
}

export interface GetUserType extends BaseType {
  Balance: number;
  BuyTransactions: GetTransaction[];
  SellTransactions: GetTransaction[];
  UserAssets: GetUserAssets[];
}

export interface GetAssetTrades extends BaseType {
  trades: GetTransaction[];
}

export const GetAssets: GetRequestType<{ assets: GetAssets[] }> = () => {
  return hubClient.get(`/assets`);
};

export const GetUserAssets: GetRequestType<{
  assets: GetUserAssets[];
}> = () => {
  return hubClient.get(`/users/assets`);
};

export const GetAllTrades: GetRequestType<{
  trades: GetTransaction[];
}> = () => {
  return hubClient.get(`/trade/`);
};

export const GetUser: GetRequestType<{ user: GetUserType }> = () => {
  return hubClient.get(`/users/`);
};

export interface GetAssetTradesType {
  assetId: string;
}

export const GetAssetTrades: PostRequestType<
  GetAssetTradesType,
  { trades: GetTransaction[] }
> = (req) => {
  return hubClient.get(`/trade/asset`, {
    params: {
      AssetId: req.assetId,
    },
  });
};

export interface PostCreateTransactionType {
  assetId: string;
  type: 'buy' | 'sell';
  Amount: number;
  Price: number;
}

export interface PostCompleteTransactionType {
  TransactionId: string;
}

export const PostCreateTransaction: PostRequestType<
  PostCreateTransactionType,
  GetTransaction
> = (body) => {
  return hubClient.post<GetTransaction>(`/trade/create`, body);
};

export const PostCompleteTransaction: PostRequestType<
  PostCompleteTransactionType,
  GetTransaction
> = (body) => {
  return hubClient.post<GetTransaction>(`/trade/complete`, body);
};
