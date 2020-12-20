import { Model } from '../../src/models/model';
import { debug } from './setup';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const model = new Model('test_table');

(async () => {
  try {
    const columns = [ 'test_column1', 'test_column2' ];
    const uniqueColumns = [ 'test_column1' ];

    // add a row
    const rowObj = {
      test_column1: 'test_column1 value',
      test_column2: 'test_column2 value',
    };
    await model.insertWithReturn(columns, rowObj);
    // DEBUG=app:model to watch database activity
    await sleep(1500); // so modified_date column is visibly later create_date
    // update the row
    rowObj.test_column2 = 'test_column2 modified value';
    await model.insertOrUpdate(columns, rowObj, uniqueColumns);
    // avoids the 2-second pause if you let node and/or ElephantSQL free up the connections
    await model.endThePool();
  } catch (err) {
    console.log('error:', err.message);
    // ElephantSQL frees up connections within a few seconds, so ending the pool not important
    // await model.endThePool();
    process.exit(1);
  }
})().catch(e => console.log('main script error:', e)); // in case there were a throw in the catch block
