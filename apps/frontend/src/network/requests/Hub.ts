import { BaseType, GetRequestType, hubClient, PostRequestType } from ".";

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

export interface GetAssetTrades extends BaseType {
  trades: GetTransaction[];
}

export const GetAssets: GetRequestType<{ assets: GetAssets[] }> = (auth) => {
  return hubClient.get(`/assets`, {
    headers: {
      access: auth,
    },
  });
};

export const GetUserAssets: GetRequestType<{ assets: GetUserAssets[] }> = (
  auth
) => {
  return hubClient.get(`/users/assets`, {
    headers: {
      access: auth,
    },
  });
};

export const GetAllTrades: GetRequestType<{ trades: GetTransaction[] }> = (
  auth
) => {
  return hubClient.get(`/trade/`, {
    headers: {
      access: auth,
    },
  });
};

export const GetUser: GetRequestType<{user: GetUserType }> = (auth) => {
  return hubClient.get(`/users/`, {
    headers: {
      access: auth,
    }
  })
}

export interface GetAssetTradesType {
  access: string;
  assetId: string;
}

export const GetAssetTrades: PostRequestType<GetAssetTradesType, {trades: GetTransaction[]}> = (req) => {
  return hubClient.get(`/trade/asset`, {
    headers: {
      access: req.access,
    },
    params: {
      AssetId: req.assetId,
    },
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
  return hubClient.post<GetTransaction>(
    `/trade/create`,
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
  return hubClient.post<GetTransaction>(`/trade/complete`, body.body, {
    headers: {
      access: body.access,
    },
  });
};
