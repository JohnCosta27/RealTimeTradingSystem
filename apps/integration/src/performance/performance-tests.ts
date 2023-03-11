import fs from "fs";
import request from "supertest";

const liveHub = "http://hub.johncosta.tech";
const liveAuth = "http://auth.johncosta.tech";
// const liveHub = "http://localhost:4545";
// const liveAuth = "http://localhost:4546";

const health = "/health";
const assets = "/assets";
const login = "/login";
const createTrade = "/trade/create";
const completeTrade = "/trade/complete";
const getTrades = "/trade/";

const silver = "f2e6a94f-b50b-4b7d-9c32-f444104715be";

type Urls =
  | typeof health
  | typeof assets
  | typeof login
  | typeof createTrade
  | typeof completeTrade
  | typeof getTrades;

const results: Record<Urls, Array<number>> = {
  "/health": [],
  "/assets": [],
  "/login": [],
  "/trade/create": [],
  "/trade/complete": [],
  "/trade/": [],
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

async function GetAccessToken(email?: string): Promise<string> {
  const access = await request(liveAuth).post(login).send({
    email: email ?? "testing1@email.com",
    password: "SafePassword123.",
  });
  return access.body["access"];
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
  await runAndAverage(100, results["/trade/create"], async () => {
    const bruh = await request(liveHub)
      .post(createTrade)
      .set({
        access: accessToken,
      })
      .send({
        AssetId: silver,
        Type: "sell",
        Amount: 1,
        Price: 1,
      });
    console.log(bruh.body);
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
    await request(liveHub)
      .post(completeTrade)
      .set({
        access: accessToken,
      })
      .send({
        TransactionId: tradeIds[counter],
      });
    counter++;
  });
}

async function HubGetTrades() {
  const access = await GetAccessToken();
  await runAndAverage(50, results['/trade/'], async () => {
    await request(liveHub).get(getTrades).set({
      access,
    });
  });
}

/**
 * To invalidate the cache, we will request all the trades twice.
 * Then we will create a trade (Hence invalidating cache),
 * and then we repeat to see the differences in response times.
 */
async function HubAllTradesInvalidateCache() {
  const access = await request(liveAuth).post(login).send({
    email: "testing2@email.com",
    password: "SafePassword123.",
  });
  console.log(access.body);
  const accessToken = access.body["access"];

  await HubCreateTrade();
  const trades = await request(liveHub).get("/trade/").set({
    access: accessToken,
  });
  const tradeIds = trades.body.trades.map((t: any) => t.Id);

  let counter = 0;
  await runAndAverage(50, [], async () => {
    await request(liveHub).get("/trade/").set({
      access: accessToken,
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await request(liveHub).get("/trade/").set({
      access: accessToken,
    });

    const cTrade = await request(liveHub)
      .post(completeTrade)
      .set({
        access: accessToken,
      })
      .send({
        TransactionId: tradeIds[counter],
      });
    counter++;
    console.log(cTrade.body);
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
  // await HubCompleteTrade();
  // await HubAllTradesInvalidateCache();
  await HubGetTrades();

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
