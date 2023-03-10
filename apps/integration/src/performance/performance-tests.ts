import fs from "fs";
import request from "supertest";

const liveHub = "http://hub.johncosta.tech";
const liveAuth = "http://auth.johncosta.tech";

const health = "/health";
const assets = "/assets";
const login = "/login";
const createTrade = "/trade/create";
const completeTrade = "/trade/complete";

type Urls =
  | typeof health
  | typeof assets
  | typeof login
  | typeof createTrade
  | typeof completeTrade;

const results: Record<Urls, Array<number>> = {
  "/health": [],
  "/assets": [],
  "/login": [],
  "/trade/create": [],
  "/trade/complete": [],
};

async function HubHealth() {
  await runAndAverage(50, results["/health"], async () => {
    await request(liveHub).get(health);
  });
}

async function HubAssets() {
  await runAndAverage(50, results["/assets"], async () => {
    await request(liveHub).get(assets);
  });
}

async function HubCreateTrade() {
  const access = await request(liveAuth).post(login).send({
    email: "testing1@email.com",
    password: "SafePassword123.",
  });
  const accessToken = access.body["access"];

  /**
   * This test account has silver by default.
   */
  await runAndAverage(200, results["/trade/create"], async () => {
    const bruh = await request(liveHub)
      .post(createTrade)
      .set({
        access: accessToken,
      })
      .send({
        AssetId: "f2e6a94f-b50b-4b7d-9c32-f444104715be",
        Type: "sell",
        Amount: 1,
        Price: 1,
      });
    console.log(bruh);
  });
}

async function HubCompleteTrade() {
  const access = await request(liveAuth).post(login).send({
    email: "testing2@email.com",
    password: "SafePassword123.",
  });
  const accessToken = access.body["access"];

  const trades = await request(liveHub).get("/trade/").set({
    access: accessToken,
  });
  const tradeIds = trades.body.trades.map((t: any) => t.Id);

  await runAndAverage(50, [], async () => {
    let counter = 0;
    const bruh = await request(liveHub).post(completeTrade).set({
      access: accessToken,
    }).send({
      TransactionId: tradeIds[counter], 
    });
    console.log(bruh);
    counter++;
  });
}

async function AuthLogin() {
  await runAndAverage(50, results["/login"], async () => {
    await request(liveAuth).post(login).send({
      email: "testing1@email.com",
      password: "SafePassword123.",
    });
  });
}

async function runAndAverage(
  times: number,
  resultsArr: number[],
  callback: () => Promise<void>
): Promise<number> {
  let totalTimeDiff = 0;
  for (let i = 0; i < times; i++) {
    const timeBefore = new Date().getTime();
    await callback();
    const diff = new Date().getTime() - timeBefore;
    resultsArr.push(diff);
    totalTimeDiff += diff;
  }
  const average = totalTimeDiff / times;
  printAverage(average);
  return average;
}

function printAverage(timeMs: number) {
  console.log(`Time taken: ${timeMs}ms`);
}

async function runPerfTests() {
  // await HubHealth();
  // await HubAssets();
  // await AuthLogin();
  // await HubCreateTrade();
  await HubCompleteTrade();
  console.log(results);

  return;
  fs.writeFile("./results.json", JSON.stringify(results), (err) => {
    if (err) {
      console.log(err);
      throw new Error("Unable to write test data to file");
    } else {
      console.log("Test data saved!");
    }
  });
}

(async () => {
  await runPerfTests();
})();
