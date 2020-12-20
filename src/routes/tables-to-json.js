import express from 'express';
import { debug } from './setup.js';
import { tableToJson } from '../controllers/index.js';
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
  // ttd implement asyncRequest to ensure catching and
  //     avoid 500 error boilerplate everywhere
  //     asyncRequest.bind(null, handler)
  //       the handler is 'curried' (not clear that it returns a function, obvs in this context
  //       but binding is more clear ... so, consider binding instead of currying for 
  //       partial application ... it is good to be consistent)
  // ttd: look at Bluebird at some point - to catch all errors everywhere
  tableToJsonRouter.get(`/${table}`, tableToJson(table));
}
debug('tableToJsonRouter: %O', tableToJsonRouter);

// indexRouter.post('/messages', modifyMessage, performAsyncAction, addMessage);

export { tableToJsonRouter };
