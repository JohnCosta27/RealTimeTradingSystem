export * from './requests';
export * from './QueryProvider';
export * from './WebSocket';

export const Requests = {
  AllTrades: 'all-trades',
  Assets: 'assets',
  UserAssets: 'user-assets',
  User: 'user',
  AssetTrades: 'asset-trades',
} as const;
