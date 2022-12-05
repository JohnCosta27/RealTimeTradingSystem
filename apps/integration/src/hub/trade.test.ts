import { AuthUrl, createTrade, HubUrl, l, testEmail, testPassword, trade } from "config";
import request from "supertest";

let access: string;

describe("Trade routes testing", () => {
  beforeAll((done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(l)
      .send({
        email: testEmail,
        password: testPassword,
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
      .set('access', access)
      .send({
        wrong: 'data',
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
})
