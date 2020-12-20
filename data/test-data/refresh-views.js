/* eslint-disable indent */
import { Model, sql } from '../../src/models/model';
import { debug } from './setup';

const model = new Model('test_table');

(async () => {
  try {
    const statements = [

sql`REFRESH MATERIALIZED VIEW CONCURRENTLY test_materialized_view`,

    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const stmt of statements.slice(0, Infinity)) {
      const res = await model.runQueryWithReturn(stmt);
      debug('\nSTATEMENT: %s', stmt);
      // debug('query result: %O', res);
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
