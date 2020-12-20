import { Model } from '../../src/models/model';
import { getObjFromLocalCsvFile } from '../utils/obj-from-data-sources';

// note: db column names correspond to csv column names
//       ensure all csv column names are reflected in the create table statement
//       see note in models.js about db column name prefixes
const tablesAndFiles = [
  [
    'covid_data_state_abbreviation_original_source',
    'data/covid-data/static-public/state-abbreviations.csv'
  ],
  [
    'covid_data_state_governor_political_party_original_source',
    'data/covid-data/ballotpedia/static-public/state-governors-political-party.csv'
  ],
  [
    'covid_data_state_population_original_source',
    'data/covid-data/census-gov/static-public/state-population.csv'
  ],
  /* [
    '',
    ''
  ], */
];

// simulating named parameters with destructuring assignment notation
export async function loadLocalStaticFiles() {
  // tablesAndFiles.forEach(async ([ table, file ]) => {
  // no-restricted-syntax
  //   eslint-disable-next-line no-restricted-syntax
  for (const [ table, file ] of tablesAndFiles) {
    const content = await getObjFromLocalCsvFile(file);
    // console.log(table);
    // console.log(content);
    const model = new Model(table);
    const columns = Object.keys(content[0]);

    // const testContent = content.slice(0, 3);
    // eslint-disable-next-line no-restricted-syntax
    for (const e of content) {
      const values = Object.values(e);
      const id = await model.getId(columns, values);
      if (!id) {
        // console.log('about to insert', columns, values);
        const inserted = await model.insertWithReturn(columns, values);
        // console.log('inserted', inserted.rows);
        // unique constraint throws if duplicates
        // test: if initialLoad and insert duplicate, constraint error thrown
      }
    }
  }
}
