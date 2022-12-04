import { AuthUrl, HubUrl, l, trade } from "config";
import request from "supertest";

describe("Trade routes testing", () => {
  let access: string;
  beforeAll((done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(l)
      .send({
        email: "testing@user.com",
        password: "password",
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
      .set('access', access)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        console.log(res.body);
        expect(res.body["trades"])
        done();
      });
  })
});
