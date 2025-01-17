import crypto from 'crypto';
import request from "supertest";
import { AuthUrl, r } from "../config";

describe("Register route testing", () => {
  const testRegisterEmail = crypto.randomUUID();
  it("Should have application/json type", (done: jest.DoneCallback) => {
    request(AuthUrl).post(r).expect("Content-Type", /json/).end(done);
  });

  it("Should give error message with no body", (done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(r)
      .expect(400)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toMatchInlineSnapshot(`
{
  "error": "Incorrect body",
  "expected": {
    "email": "",
    "firstname": "",
    "password": "",
    "surname": "",
  },
}
`);
        done();
      });
  });

  it("Should success when all fields are provided", (done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(r)
      .send({
        email: testRegisterEmail,
        firstname: "John",
        surname: "Costa",
        password: "SafePassword123.",
      })
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["access"]).not.toBeNull();
        expect(res.body["refresh"]).not.toBeNull();
        done();
      });
  });

  it("Should return error when trying to register same email", (done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(r)
      .send({
        email: testRegisterEmail,
        firstname: "John",
        surname: "Costa",
        password: "SafePassword123.",
      })
      .expect(400)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body).toMatchInlineSnapshot(`
{
  "Error": "Duplicate email found",
}
`);
        done();
      });
  });
});
