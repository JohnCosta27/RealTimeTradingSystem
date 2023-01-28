import { HubUrl, assets } from "config";
import request from "supertest";

describe("Asset routes testing", () => {
  it("Should not return error without jwt", (done: jest.DoneCallback) => {
    request(HubUrl)
      .get(assets)
      .expect(200)
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
