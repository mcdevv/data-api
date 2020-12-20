import { Model } from '../../src/models/model';
import { debug } from './setup';

const model = new Model('test_table');

(async () => {
  try {
    const columns = [ 'test_column1', 'test_column2' ];
    const uniqueColumns = [ 'test_column1' ];

    // update a row
    const rowObj = {
      test_column1: 'test_column1 value',
      test_column2: 'test_column2 periodic updated value',
    };
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


// select * from test_table


/* 

sql inserts in chunks of three
async function timeTest() {
  const timeoutPromise1 = timeoutPromise(3000);
  const timeoutPromise2 = timeoutPromise(3000);
  const timeoutPromise3 = timeoutPromise(3000);

  await timeoutPromise1;
  await timeoutPromise2;
  await timeoutPromise3;
}
... vs promise.all??? rejected if any of the iterable promises rejects
note: i;m catching errors, but rejected promises? whole db load needs to STOP




*/
