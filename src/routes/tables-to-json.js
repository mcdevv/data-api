import express from 'express';
import { tableToJson } from '../controllers';
// import { modifyMessage, performAsyncAction } from '../middleware';

const tableToJsonRouter = express.Router();
const tables = [ // ttd: generate file at build time with this info
  'covid_data_state_abbreviation_original_source',
  'covid_data_state_governor_political_party_original_source',
  'covid_data_state_population_original_source',
  'covid_data_state_abbreviation',
  'covid_data_state_governor_political_party',
  'covid_data_state_population',
];
// eslint-disable-next-line no-restricted-syntax
for (const table of tables) {
  tableToJsonRouter.get(`/${table}`, tableToJson(table));
}
console.log({ tableToJsonRouter });
// indexRouter.post('/messages', modifyMessage, performAsyncAction, addMessage);

export { tableToJsonRouter };
