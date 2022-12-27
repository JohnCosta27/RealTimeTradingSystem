import { AuthUrl, l, re, testData } from "config";
import request from "supertest";

describe("Register route testing", () => {
  let accessToken = "";
  let refreshToken = "";

  beforeAll((done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(l)
      .send({
        email: testData.users[0].email,
        password: testData.users[0].password,
      })
      .end((_, res) => {
        accessToken = res.body["access"];
        refreshToken = res.body["refresh"];
        done();
      });
  });

  it("Should return error and body structure", (done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(re)
      .expect(400)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toMatchInlineSnapshot(`
{
  "error": "Incorrect body",
  "expected": {
    "refresh": "",
  },
}
`);
        done();
      });
  });

  it("Should return error when sending incorrect token", (done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(re)
      .send({
        refresh: accessToken,
      })
      .expect(400)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toMatchInlineSnapshot(`
{
  "error": "Bad refresh token given",
}
`);
        done();
      });
  });

  it("Should return access token", (done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(re)
      .send({
        refresh: refreshToken,
      })
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["access"]).toBeDefined();
        done();
      });
  });
});
