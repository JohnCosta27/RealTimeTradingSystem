import request from "supertest";

const liveHub = 'http://hub.johncosta.tech';


describe('Measuring base line performance (Health of app)', () => {
  it("Should return", (done: jest.DoneCallback) => {
    const timeBefore = new Date().getTime();
    request(liveHub).get('/health').expect(200).end(() => {
      const timeAfter = new Date().getTime();
      console.log(`Time taken: ${timeAfter - timeBefore}ms`);
      done();
    });
  });
})

it('Measures assets', (done: jest.DoneCallback) => {
  const timeBefore = new Date().getTime();
  request(liveHub).get('/assets').expect(200).end(() => {
    const timeAfter = new Date().getTime();
    console.log(`Time taken: ${timeAfter - timeBefore}ms`);
    done();
  });
})
