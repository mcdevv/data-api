/* eslint-disable indent */
import { Model } from '../../src/models/model';
import { debug } from './setup';

const model = new Model('test_materialized_view');

(async () => {
  try {
    const res = await model.select([ 'test_column' ]);
    // console.log('result:', res.rows[0]);
    if (res.rows[0].tmv_test_column !== 'test_column1 value - test_column2 periodic updated value') {
      throw new Error(
        `unexpected value for tmv_test_column: 
         expected: 'test_column1 value - test_column2 periodic updated value'
         found: ${res.rows[0].tmv_test_column}
        `
      );
    }
    await model.endThePool();
  } catch (err) {
    console.error('error:', err.message);
    // ElephantSQL frees up connections within a few seconds, so ending the pool not important
    // await model.endThePool();
    process.exit(1);
  }
})();
