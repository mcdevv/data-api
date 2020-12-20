/* eslint-disable indent */
import { Model } from '../../src/models/model';
import { debug } from './setup';

const model = new Model('test_materialized_view');

(async () => {
  try {
    const res = await model.select([ 'test_column' ]);
    // debug('query result: %O', res);
    // DEBUG=app:model to watch database activity
    if (res.rows[0].tmv_test_column !== 'test_column1 value - test_column2 modified value') {
      throw new Error(
        `unexpected value for tmv_test_column: 
         expected: 'test_column1 value - test_column2 modified value'
         found: ${res.rows[0].tmv_test_column}
        `
      );
    }
    // avoids the 2-second pause if you let node and/or ElephantSQL free up the connections
    await model.endThePool();
  } catch (err) {
    console.log('error:', err.message);
    // ElephantSQL frees up connections within a few seconds, so ending the pool not important
    // await model.endThePool();
    process.exit(1);
  }
})().catch(e => console.log('main script error:', e)); // in case there were a throw in the catch block
