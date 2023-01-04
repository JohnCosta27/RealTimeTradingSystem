import { AuthUrl, HubUrl, l, testData, userAssets, user } from "config";
import request from "supertest";

describe("User Asset routes testing", () => {
  let access: string;
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
              Asset: expect.objectContaining({
                Id: expect.any(String),
                Name: expect.any(String),
              }),
            }),
          ])
        );
        done();
      });
  });

  it("Should return the user object", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(user)
      .set("access", access)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["user"]).toEqual(
          expect.objectContaining({
            Id: expect.any(String),
            Balance: expect.any(Number),
            UserAssets: expect.arrayContaining([
              expect.objectContaining({
                Amount: expect.any(Number),
                Asset: expect.objectContaining({
                  Id: expect.any(String),
                  Name: expect.any(String),
                }),
              }),
            ]),
          })
        );
        done();
      });
  });
});
