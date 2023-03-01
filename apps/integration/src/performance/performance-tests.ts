import request from "supertest";

const liveHub = "http://hub.johncosta.tech";

async function HubHealth() {
  const average = await runAndAverage(10, async () => {
    await request(liveHub).get("/health");
  });
  printAverage(average);
}

async function HubAssets() {
  runAndAverage(10, async () => {
    await request(liveHub).get("/assets");
  }).then(printAverage);
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
  return totalTimeDiff / times;
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
