import request from "supertest";

const liveHub = "http://hub.johncosta.tech";

async function HubHealth() {
  await runAndAverage(10, async () => {
    await request(liveHub).get("/health");
  });
}

async function HubAssets() {
  await runAndAverage(10, async () => {
    await request(liveHub).get("/assets");
  });
}

async function runAndAverage(
  times: number,
  callback: () => Promise<void>
): Promise<number> {
  let totalTimeDiff = 0;
  for (let i = 0; i < times; i++) {
    const timeBefore = new Date().getTime();
    await callback();
    totalTimeDiff += new Date().getTime() - timeBefore;
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
}

(async () => {
  await runPerfTests();
})();
