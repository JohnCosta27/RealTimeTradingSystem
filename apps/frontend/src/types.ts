import { JSX } from 'solid-js';

export interface Child {
  children: JSX.Element;
}

export const Requests = {
  AllTrades: 'all-trades',
  Assets: 'assets',
  UserAssets: 'user-assets',
} as const;
