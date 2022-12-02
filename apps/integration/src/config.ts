import * as dotenv from 'dotenv';
dotenv.config();

export const HubUrl = process.env.HUB_URL;
export const AuthUrl = process.env.AUTH_URL;

export const r = '/register';
export const l = '/login';
export const re = '/refresh';

if (!HubUrl) {
  throw new Error("HUB_URL must be present in .env file");
}

if (!AuthUrl) {
  throw new Error("AUTH_URL must be present in .env file");
}
