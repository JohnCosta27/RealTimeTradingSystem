import crypto from "crypto";
import fs from "fs";
import { PrismaClient as AuthPrismaClient } from "./generated/auth";
import { PrismaClient as BrainPrismaClient } from "./generated/brain";

import * as dotenv from 'dotenv';
dotenv.config();

export interface TestData {
  users: Array<{id: string; balance: number; email: string; password: string}>;
  assets: Array<{id: string}>
  userAssets: Array<{id: string, userId: string; assetId: string}>
}

const DEFAULT_BALANCE = 10000;
const DEFAULT_PASSWORD = "password";

export async function Setup(): Promise<TestData> {
  const authClient = new AuthPrismaClient();
  const brainClient = new BrainPrismaClient();

  // Delete all users before tests run.
  // And all other user information in both auth and brain services.
  await authClient.users.deleteMany({});
  await brainClient.user_assets.deleteMany({});
  await brainClient.transactions.deleteMany({});
  await brainClient.assets.deleteMany({});
  await brainClient.users.deleteMany({});
  console.log("Purged databases successfully");

  const uuid = crypto.randomUUID();
  const otherUuid = crypto.randomUUID();

  const userPassword = crypto
    .createHash("sha512")
    .update(DEFAULT_PASSWORD, "utf8")
    .digest("hex");

  const otherPassword = crypto
    .createHash("sha512")
    .update(DEFAULT_PASSWORD, "utf8")
    .digest("hex");

  const firstUser = await authClient.users.create({
    data: {
      id: uuid,
      firstname: "Testing1",
      surname: "User",
      email: "testing1@email.com",
      password_salt: "",
      password: userPassword,
    },
  }).catch(e => console.log(e));

  const secondUser = await authClient.users.create({
    data: {
      id: otherUuid,
      firstname: "Testing2",
      surname: "User",
      email: "testing2@user.com",
      password_salt: "",
      password: otherPassword,
    },
  });

  await brainClient.users.create({
    data: {
      id: uuid,
      balance: DEFAULT_BALANCE,
    },
  });

  await brainClient.users.create({
    data: {
      id: otherUuid,
      balance: DEFAULT_BALANCE,
    },
  });

  const gold = await brainClient.assets.create({
    data: {
      name: "Gold",
    },
  });

  const userAsset = await brainClient.user_assets.create({
    data: {
      asset_id: gold.id,
      user_id: firstUser!.id,
      amount: 20,
    },
  });

  await brainClient.transactions.create({
    data: {
      seller_id: firstUser!.id,
      amount: 10,
      price: 1000,
      asset_id: gold.id,
      state: "in-market",
    },
  });

  const testData: TestData = {
    users: [
      {
        id: firstUser!.id,
        balance: DEFAULT_BALANCE,
        email: firstUser!.email,
        password: DEFAULT_PASSWORD,
      },
      {
        id: secondUser!.id,
        balance: DEFAULT_BALANCE,
        email: secondUser!.email,
        password: DEFAULT_PASSWORD,
      }
    ],
    assets: [
      {
        id: gold.id
      }
    ],
    userAssets: [
      {
        id: userAsset.id,
        assetId: gold.id,
        userId: firstUser!.id
      }
    ]
  }

  return testData;
}

Setup().then((testData) => {
  console.log("Test data generation complete! Saving to file...");
  fs.writeFile('./testData.json', JSON.stringify(testData), (err) => {
    if (err) {
      console.log(err);
      throw new Error("Unable to write test data to file");
    } else {
      console.log("Test data saved!");
    }
  });
});
