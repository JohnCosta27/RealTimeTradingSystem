import { AuthUrl, HubUrl, l, userAssets } from "config";
import request from "supertest";

describe("User Asset routes testing", () => {
  let access: string;
  beforeAll((done: jest.DoneCallback) => {
    request(AuthUrl)
      .post(l)
      .send({
        email: "testing@user.com",
        password: "password",
      })
      .end((_, res) => {
        console.log(res.body);
        access = res.body["access"];
        done();
      });
  });

  it("Request without a JWT should returned unauthorized", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(userAssets)
      .send({
        un: "authorized",
      })
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

  it("Should return the correct data", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(userAssets)
      .set("access", access)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["assets"]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Amount: expect.any(Number),
              Asset:  expect.objectContaining({
                Id: expect.any(String),
                Name: expect.any(String),
              })
            }),
          ])
        );
        done();
      });
  });
});
