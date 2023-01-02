import { HubUrl, assets } from "config";
import request from "supertest";

describe("Asset routes testing", () => {
  it("Should return error without authentication", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(assets)
      .expect(400)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body["assets"]).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              Id: expect.any(String),
              Name: expect.any(String),
            })
          ])
        )
        done();
      });
  });
});
