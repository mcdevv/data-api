import csv from 'csvtojson';
import { expect, server, BASE_URL } from './setup';

// ttd: test without .csv see if server still auto prefills the mime-type based on extension

describe('TEST: static-public csv files', () => {
  const staticFiles = [
    'state-abbreviations',
    'state-governors-political-party',
    'state-population',
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const staticFile of staticFiles) {
    it(`get static csv file: ${staticFile}`, async () => {
      const res = await server
        .get(`${BASE_URL}/static/${staticFile}.csv`)
        .expect(200);
      const jsonObj = await csv().fromString(res.text);
      expect(jsonObj).to.be.instanceOf(Array);
      expect(jsonObj.every(e => e.state)).to.equal(true);
      expect(jsonObj.length).to.equal(52);
    });
  }
});
