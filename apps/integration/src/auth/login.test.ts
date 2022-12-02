import { AuthUrl, r, l } from "config";
import { PrismaClient } from "generated/auth";
import request from "supertest";

const authClient = new PrismaClient();

describe("Register route testing", () => {
  beforeAll((done: jest.DoneCallback) => {
    authClient.users.deleteMany({}).then(() => {
      request(AuthUrl)
        .post(r)
        .send({
          email: "login@testing.com",
          firstname: "John",
          surname: "Costa",
          password: "SafePassword123.",
        })
        .end(done);
    });
  });

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
      email: "login@testing.com",
      password: "SafePassword123.",
    }).expect(200).end((err, res) => {
      expect(err).toBeNull();
      expect(res.body["access"]).toBeDefined();
      expect(res.body["refresh"]).toBeDefined();
      done();
    });
  });

});
