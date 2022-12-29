import { AuthUrl, l, testData } from "config";
import request from "supertest";

describe("Register route testing", () => {
  it("Should show correct body when sending incorrect data", (done: jest.DoneCallback) => {
    request(AuthUrl).post(l).send({
      wrong: "data",
    }).expect(400).end((err, res) => {
      expect(err).toBeNull();
      expect(res.body).toMatchInlineSnapshot(`
{
  "error": "Incorrect body",
  "expected": {
    "email": "",
    "password": "",
  },
}
`);
      done();
    });
  });

  it("Should give error on non-registered account", (done: jest.DoneCallback) => {
    request(AuthUrl).post(l).send({
      email: "notregister@email.com",
      password: "password",
    }).expect(400).end((err, res) => {
      expect(err).toBeNull();
      expect(res.body).toMatchInlineSnapshot(`
{
  "error": "this account doesn't exist",
}
`);
      done();
    });
  });

  it("Should allow user to sign-in", (done: jest.DoneCallback) => {
    request(AuthUrl).post(l).send({
      email: testData.users[0].email,
      password: testData.users[0].password,
    }).expect(200).end((err, res) => {
      expect(err).toBeNull();
      expect(res.body["access"]).toBeDefined();
      expect(res.body["refresh"]).toBeDefined();
      done();
    });
  });

});
