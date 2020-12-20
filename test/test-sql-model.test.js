/* eslint-disable max-len */
import { expect, debug } from './setup';
import { Model } from '../src/models/model';

// must have built the test table; see ./data/test-data/initial-data-load.sh for command

const model = new Model('test_table');
const columns = [ 'test_column1', 'test_column2' ];
const uniqueColumns = [ 'test_column1' ];
const testColumn1Value = 'test_column1 unit test value';
const testColumn2Value = 'test_column2 unit test value';
const rowObj = {
  test_column1: testColumn1Value,
  test_column2: testColumn2Value,
};
const testColumn2UpdateValue = 'test_column2 updated unit test value';
const rowObjUpdate = {
  test_column1: testColumn1Value,
  test_column2: testColumn2UpdateValue,
};

// eslint-disable-next-line prefer-arrow-callback
describe('TEST: sql statements', function describeCallback() {
  // "Passing arrow functions (“lambdas”) to Mocha is discouraged.
  //    Due to the lexical binding of this, such functions are unable to
  //    access the Mocha context." ... so timeout doesn't work
  this.timeout(20000); // default timeout is sometimes too short to complete the tests
  // it() - don't pack too many tests into each it() or it is hard to distinguish which failed
  it('delete any existing test row(s)', async () => {
    const deleteRes = await model.deleteWithReturn(`WHERE tt_test_column1 = '${testColumn1Value}'`);
    debug('delete result: %O', deleteRes.rows);
    const selectRes = await model.select(
      [ 'test_column2' ],
      `WHERE tt_test_column1 = '${testColumn1Value}'`
    );
    debug('select result: %O', selectRes.rows);
    expect(selectRes.rowCount).to.equal(0);
  });

  // test getId? ... I never use it directly ...
  // might more clear to test insert and update separately,
  //   however both are called here via insertOrUpdate
  //   and both are validated by the tests

  it('test insert and select', async () => {
    const insertOrUpdateRes = await model.insertOrUpdate(columns, rowObj, uniqueColumns);
    debug('insert test, insert result: %O', {
      rows: insertOrUpdateRes.rows,
      command: insertOrUpdateRes.command,
    });
    expect(insertOrUpdateRes.command).to.equal('INSERT');
    const selectRes = await model.select(
      [ 'test_column2' ],
      `WHERE tt_test_column1 = '${testColumn1Value}'`
    );
    debug('insert test, select result: %O', selectRes.rows);
    expect(selectRes.rows.length).to.equal(1);
    expect(selectRes.rows[0].tt_test_column2).to.equal(testColumn2Value);
  });

  it('test generic query', async () => {
    const genericQueryRes = await model.runQueryWithReturn(
      `SELECT tt_test_column2 from test_table WHERE tt_test_column1 = '${testColumn1Value}'`
    );
    debug('generic query test, result: %O', genericQueryRes.rows);
    expect(genericQueryRes.rows.length).to.equal(1);
    expect(genericQueryRes.rows[0].tt_test_column2).to.equal(testColumn2Value);
  });

  it('test update', async () => {
    const insertOrUpdateRes = await model.insertOrUpdate(columns, rowObjUpdate, uniqueColumns);
    debug('update test, update result: %O', {
      rows: insertOrUpdateRes.rows,
      command: insertOrUpdateRes.command,
    });
    expect(insertOrUpdateRes.command).to.equal('UPDATE');
    const selectRes = await model.select(
      [ 'test_column2' ],
      `WHERE tt_test_column1 = '${testColumn1Value}'`
    );
    debug('update test, select result: %O', selectRes.rows);
    expect(selectRes.rows.length).to.equal(1);
    expect(selectRes.rows[0].tt_test_column2).to.equal(testColumn2UpdateValue);
  });

  it('test delete', async () => {
    const deleteRes = await model.deleteWithReturn(`WHERE tt_test_column1 = '${testColumn1Value}'`);
    debug('delete test, delete result: %O', deleteRes.rows);
    const selectRes = await model.select(
      [ 'test_column2' ],
      `WHERE tt_test_column1 = '${testColumn1Value}'`
    );
    debug('delete test, select result: %O', selectRes.rows);
    expect(selectRes.rowCount).to.equal(0);
  });

  it('end the pool', async () => {
    await model.endThePool(); // avoid the 2-second pause while pooled connections freed up
  });
});
