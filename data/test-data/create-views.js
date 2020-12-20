/* eslint-disable indent */
import { Model, sql } from '../../src/models/model';
import { debug } from './setup';

const model = new Model();

(async () => {
  try {
    const model = new Model();
    const statements = [

sql`DROP MATERIALIZED VIEW IF EXISTS test_materialized_view`,
sql`
  CREATE MATERIALIZED VIEW test_materialized_view AS
    SELECT CONCAT_WS(' - ', tt_test_column1, tt_test_column2) AS tmv_test_column
          ,tt_create_date AS tmv_create_date
          ,tt_modified_date AS tmv_modified_date
    FROM test_table
  WITH NO DATA
`, // WITH NO DATA - can't query view until the initial data load is complete via the first REFRESH
// at least one index is required in order to refresh CONCURRENTLY (after daily data load)
sql`
  CREATE UNIQUE INDEX tmv_test_column_idx_unique
  ON test_materialized_view (tmv_test_column)
`,
// the initial refresh to populate the mv
sql`REFRESH MATERIALIZED VIEW test_materialized_view`,

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
