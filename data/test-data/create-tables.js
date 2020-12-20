/* eslint-disable indent */
import { Model, sql } from '../../src/models/model';
import { debug } from './setup';

const model = new Model();

(async () => {
  try {
    const statements = [

sql`DROP MATERIALIZED VIEW IF EXISTS test_materialized_view`,
sql`DROP TABLE IF EXISTS test_table`,
sql`
    CREATE TABLE IF NOT EXISTS test_table
    (tt_id SERIAL PRIMARY KEY
    ,tt_test_column1 VARCHAR NOT NULL
    ,tt_test_column2 VARCHAR NOT NULL
    ,tt_create_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    ,tt_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    ,UNIQUE (tt_test_column1)
    )
`,

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
    console.error('error:', err.message); // logger
    // ElephantSQL frees up connections within a few seconds, so ending the pool not important
    // await model.endThePool();
    process.exit(1);
  }
})().catch(e => console.log('main script error:', e)); // in case there were a throw in the catch block
