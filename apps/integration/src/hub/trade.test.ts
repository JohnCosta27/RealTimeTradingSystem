import { AuthUrl, createTrade, HubUrl, l, testData, trade } from "config";
import request from "supertest";

let access: string;

describe("Trade routes testing", () => {
  beforeAll((done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(l)
      .send({
        email: testData.users[0].email,
        password: testData.users[0].password,
      })
      .end((_, res) => {
        access = res.body["access"];
        done();
      });
  });

  it("Request without a JWT should returned unauthorized", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(trade)
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

  it("Should return active trades", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(trade)
      .set("access", access)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["trades"]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Id: expect.any(String),
              Price: expect.any(Number),
              Amount: expect.any(Number),
              AssetId: expect.any(String),
            }),
          ])
        );
        done();
      });
  });
});

describe("Create trade endpoint", () => {
  it("Request without a JWT should returned unauthorized", (done: jest.DoneCallback) => {
    request(HubUrl)
      .post(createTrade)
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

  it("Should return the data format when sending wrong data", (done: jest.DoneCallback) => {
    request(HubUrl)
      .post(createTrade)
      .set("access", access)
      .send({
        wrong: "data",
      })
      .expect(400)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toMatchInlineSnapshot(`
{
  "error": "Incorrect body",
  "expected": {
    "Amount": 0,
    "Price": 0,
    "assetId": "",
    "type": "",
  },
}
`);
        done();
      });
  });

  it("Should be able to create a sell transaction", (done: jest.DoneCallback) => {
    request(HubUrl)
      .post(createTrade)
      .set("access", access)
      .send({
        Amount: 10,
        Price: 10,
        assetId: testData.userAssets.find(
          (i) => i.userId === testData.users[0].id
        )?.assetId,
        type: "sell",
      })
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["trade"]).toEqual(
          expect.objectContaining({
            Id: expect.any(String),
            AssetId: expect.any(String),
            SellerId: expect.any(String),
          })
        );
        expect(res.body["trade"]["BuyerId"]).toEqual("");
        expect(res.body["trade"]["Price"]).toEqual(10);
        expect(res.body["trade"]["Amount"]).toEqual(10);
        done();
      });
  });
});
