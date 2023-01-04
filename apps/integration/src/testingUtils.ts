import { AuthUrl, l } from "config";
import request from "supertest";

export async function getAccessToken(email: string, password: string): Promise<string> {
  const req = await request(AuthUrl).post(l).send({
    email,
    password,
  });

  if (!req.body["access"]) {
    throw new Error("Login method did not return access token");
  }

  return req.body["access"];
}
