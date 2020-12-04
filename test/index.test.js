import { expect, server, BASE_URL } from './setup';
// change name to index-page.test.js
describe('TEST: index page', () => {
  // https://mochajs.org/#getting-started
  it('get base url', done => {
    server
      .get(`${BASE_URL}/`)
      .expect(200) // note: you can pass done as 2nd param to expect calls: .expect(200, done);
      .end((err, res) => {
        expect(res.status).to.equal(200); // a chai assertion
        expect(res.body.message).to.equal(
          'this is the value of TEST_ENV_VARIABLE'
        );
        done();
      });
  });
});
