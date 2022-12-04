import { AuthUrl, HubUrl, l, testEmail, testPassword, trade } from "config";
import request from "supertest";

describe("Trade routes testing", () => {
  let access: string;
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
