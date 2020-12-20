import fetch from 'node-fetch';
import { Model } from '../../../src/models/model';
import { debug } from './setup';
import { arrayToGroupsOf } from '../../utils/misc';

(async () => {
  try {
    debug('Covid-tracking US data: ');
    const dataSourceUrl = 'https://api.covidtracking.com/v1/us/daily.json';
    const response = await fetch(dataSourceUrl);
    const content = (await response.json()).slice(0, Infinity);
    debug('sample data row: content[0]: %O', content[0]);

    const tableName = 'covid_data_covid_tracking_us_original_source';
    const model = new Model(tableName);
    const columnNames = Object.keys(content[0]);
    debug('columnNames: %O', columnNames);

    const availableDBConnections = 3;
    const itemsPerGroup = Math.ceil(content.length / availableDBConnections);
    debug('itemsPerGroup:', itemsPerGroup);
    const groups = arrayToGroupsOf(content, itemsPerGroup);

    // function for awaiting API call for each item in a group
    const insertGroup = async items => {
      debug('insertGroup, before looping');
      // eslint-disable-next-line no-restricted-syntax
      for (const item of items) {
        try {
          const inserted = await model.insertWithReturn(columnNames, item);
          // debug('inserted: %O', inserted.rows);
        } catch (err) {
          debug('catch API rejection:', err);
          // Promise.all returns as soon as one of its promises rejects
          return Promise.reject(err);
        }
      }
      return `${items.length} items inserted`;
    };
    const all = await Promise.all(
      groups.map(group => insertGroup(group))
    ).catch(err => {
      console.log('error: one of the Promise.all promises rejected, throw:', err);
      throw new Error('error: all; this failed:', err);
    });
    debug('result of Promise.all: %O', all);
    debug('about to end the pool');
    await model.endThePool();
  } catch (err) {
    console.log('error:', err.message);
    process.exit(1);
  }
})().catch(e => console.log('main script error:', e)); // in case there were a throw in the catch block
