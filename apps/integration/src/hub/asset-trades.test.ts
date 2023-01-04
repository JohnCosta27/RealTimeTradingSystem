import { assetTrades, HubUrl, testData } from "config";
import request from "supertest";
import { getAccessToken } from "testingUtils";

describe("Asset trades route testing", () => {
  let access: string;
  beforeAll((done: jest.DoneCallback) => {
    getAccessToken(testData.users[0].email, testData.users[0].password).then(
      (res) => {
        access = res;
        done();
      }
    );
  });

  it("Should give trades for a given asset (without need for authentication)", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(assetTrades)
      .expect(401)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toMatchInlineSnapshot(`
{
  "error": "unauthorized",
}
`);
        done();
      });
  });

  it("Should return not found for a non existent asset id", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(assetTrades)
      .set("access", access)
      .set("AssetId", "a wrong id")
      .expect(404)
      .end((err, res) => {
        console.log(err);
        console.log(res.body);
        expect(err).toBeNull();
        expect(res.body).toMatchInlineSnapshot(`
{
  "error": "This asset could not be found",
}
`);
        done();
      });
  });

  it("Should return the trades for an existing asset", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(assetTrades)
      .set("access", access)
      .set("AssetId", testData.transactions[0].assetId)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["trades"]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Id: testData.transactions[0].id,
              Amount: testData.transactions[0].amount,
              Price: testData.transactions[0].price,
              AssetId: testData.transactions[0].assetId,
              State: "in-market",
            }),
          ])
        );
        done();
      });
  });
});