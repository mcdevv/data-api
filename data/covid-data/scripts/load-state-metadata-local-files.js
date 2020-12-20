import { Model } from '../../../src/models/model';
import { debug } from './setup';
import { getObjFromLocalCsvFile } from '../../utils/obj-from-data-sources';
import { arrayToGroupsOf } from '../../utils/misc';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// note: db column names must correspond to csv column names
//       ensure ALL csv column names are reflected in the create table statement
//       see note in models.js about db column name prefixes
//       ttd: this may be documentation appropriate for the model.js
const tablesAndFiles = [
  [
    'covid_data_state_abbreviation_original_source',
    'data/covid-data/data-sources/state-abbreviations/static-public/state-abbreviations.csv'
  ],
  [
    'covid_data_state_governor_political_party_original_source',
    'data/covid-data/data-sources/ballotpedia/static-public/state-governors-political-party.csv'
  ],
  [
    'covid_data_state_population_original_source',
    'data/covid-data/data-sources/census-gov/static-public/state-population.csv'
  ],
  /* [
    '',
    ''
  ], */
];

(async () => {
  try {
    let model;
    //   eslint-disable-next-line no-restricted-syntax
    for (const [ table, file ] of tablesAndFiles.slice(0, Infinity)) {
      debug('loading table: %s from file: %s', table, file);
      const content = await getObjFromLocalCsvFile(file);
      model = new Model(table);
      const columns = Object.keys(content[0]);
      debug('csv columns: %O', columns);
      debug('first row: %O', content[0]);

      // ElephantSQL API free tier allows 5 concurrent connections
      //   one connection is constantly used by the system
      //   leave one for other sync tasks and/or front-end requests
      //     front-end would be slow but usable?
      //     ttd: test front end while the back-end is loading, free tier may not be sufficient
      //          serve as much as possible from static files ... reduces down time when mv refresh
      const chunks = arrayToGroupsOf(content, 3).slice(0, Infinity);
      // 50% improvement with full amount of data using all 4 connections ... 

      // eslint-disable-next-line no-restricted-syntax
      for (const chunk of chunks) {
        debug('about to insert for %s: %O', columns, chunk);
        // see faster approach in load-covid-tracking-us-data.js
        // the following approach is fast enough for this amount of data, though
        const all = await Promise.all(
          // no-loop-func: "This rule disallows any function within a loop that contains
          //   unsafe references (e.g. to modified variables from the outer scope)."
          //   however, variables columns and model are const ...
          // eslint-disable-next-line no-loop-func
          chunk.map(rowObj => {
            debug('calling insertWithReturn for %s: %O', columns, rowObj);
            return model.insertWithReturn(columns, rowObj);
            // .catch(e => console.log(`Error: ${e}`));
            // if handle rejections here a rejection won't
            //   trigger Promise.all to reject
          })
        ).then(res => {
          debug('successful inserts: %O', res.rows);
        }).catch(err => {
          debug('error: this insert failed: %O', err);
          throw new Error('error: this insert failed: %O', err);
        });
        debug('result of Promise.all: %O', all);
      }
    }
    await model.endThePool();
  } catch (err) {
    console.log('error:', err.message);
    process.exit(1);
  }
})().catch(e => console.log('main script error:', e)); // in case there were a throw in the catch block
