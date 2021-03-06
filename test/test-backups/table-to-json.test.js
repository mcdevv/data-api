import { expect, server, BASE_URL } from './setup';

describe('TEST: table to JSON', function describeCallback() {
  this.timeout(10000); // elephantSQL hosted free db goes to 'sleep' so first query is slow

  const tables = [ // ttd: generate file at build time with this info
    'covid_data_state_abbreviation_original_source',
    'covid_data_state_population_original_source',
    'covid_data_state_governor_political_party_original_source',
    'covid_data_state_abbreviation',
    'covid_data_state_population',
    'covid_data_state_governor_political_party'
  ];

  // 52 states and territories should be the same in all state tables
  const statesSet = new Set();

  // eslint-disable-next-line no-restricted-syntax
  for (const table of tables) {
    it(`get json for table: ${table}`, async () => {
      // synchronous because only 5 connections in db pool on free tier
      const res = await server.get(`${BASE_URL}/table-to-json/${table}`);
      expect(res.status).to.equal(200, `table: ${table} res.status is not 200`);

      expect(res.body.length).to.be.above( // minimal check that some data got in
        51,
        `table: ${table} num rows: ${res.body.length} - num rows should be at least 51`
      );

      expect(res.body).to.be.instanceOf(Array, `table: ${table} `);

      // each obj must have truthy 'state' property
      expect(res.body.every(e => e.state)).to.equal(true, `table: ${table} not all rows contain a state`);

      // make sure all state tables have the same states and territories
      if (table === 'covid_data_state_abbreviation') { // make sure this table comes first in the tables array
        res.body.forEach(({ state }) => statesSet.add(state));
      } else if ([
        'covid_data_state_population',
        'covid_data_state_governor_political_party'
      ].includes(table)) {
        // console.log(statesSet.values());
        // already know there are at least 52 entries
        //   so, make sure each of the expected states is in the other tables
        statesSet.forEach(state => {
          expect(res.body.some(e => e.state === state)).to.equal(true, `table: ${table} missing state: ${state}`);
        });
      }
    });
  }
});
