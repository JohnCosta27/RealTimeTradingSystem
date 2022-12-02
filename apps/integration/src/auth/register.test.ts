import request from "supertest";
import { AuthUrl } from "../config";

const r = "/register";

describe("Register route testing", () => {
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
});
