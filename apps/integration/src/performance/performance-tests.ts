import fs from "fs";
import request from "supertest";

const liveHub = "http://hub.johncosta.tech";
const liveAuth = "http://auth.johncosta.tech";

const health = '/health';
const assets = '/assets';
const login = '/login';

type Urls = typeof health | typeof assets | typeof login;

const results: Record<Urls, Array<number>> = {
  "/health": [],
  "/assets": [],
  "/login": [],
}

async function HubHealth() {
  await runAndAverage(50, results['/health'], async () => {
    await request(liveHub).get(health);
  });
}

async function HubAssets() {
  await runAndAverage(50, results['/assets'], async () => {
    await request(liveHub).get(assets);
  });
}

async function AuthLogin() {
  await runAndAverage(50, results['/login'], async () => {
    await request(liveAuth).post(login).send({
      email: 'testing1@email.com',
      password: 'SafePassword123.',
    });
  })
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
    const diff = new Date().getTime() - timeBefore
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
  await HubHealth();
  await HubAssets();
  await AuthLogin();
  console.log(results);

  fs.writeFile('./no-cache-results.json', JSON.stringify(results), (err) => {
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
