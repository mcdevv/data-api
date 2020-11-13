import { expect, server, BASE_URL } from './setup';
// change name to index-page.test.js
describe('Index page test', () => { // https://mochajs.org/#getting-started
  it('get base url', done => {
    server
      .get(`${BASE_URL}/`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          'this is the value of TEST_ENV_VARIABLE'
        );
        done();
      });
  });
});
