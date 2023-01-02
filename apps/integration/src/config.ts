import fs from 'fs';
import * as dotenv from 'dotenv';
import { TestData } from 'setup';
dotenv.config();

export const HubUrl = process.env.HUB_URL;
export const AuthUrl = process.env.AUTH_URL;

export const r = '/register';
export const l = '/login';
export const re = '/refresh';
export const userAssets = '/users/assets';
export const assets = '/assets';
export const trade = '/trade/';
export const createTrade = '/trade/create';
export const completeTrade = '/trade/complete';
export const assetTrades = '/trade/asset';

if (!HubUrl) {
  throw new Error("HUB_URL must be present in .env file");
}

if (!AuthUrl) {
  throw new Error("AUTH_URL must be present in .env file");
}

export const testData: TestData = JSON.parse(fs.readFileSync('./testData.json', 'utf8'));
