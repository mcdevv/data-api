import { expect } from './setup';
import { Model } from '../src/models/model';

const model = new Model('test_table');
const columns = [ 'columnName' ];
const values = [ Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString() ];

// eslint-disable-next-line prefer-arrow-callback
describe('TEST: sql statements', function describeCallback() {
  // ttd: "Passing arrow functions (“lambdas”) to Mocha is discouraged. 
  //  Due to the lexical binding of this, such functions are unable to 
  //  access the Mocha context." so timeout doesn't work
  this.timeout(20000);
  it('test insert', async () => {
    const inserted = await model.insertWithReturn(columns, values);
    // console.log('inserted', inserted.rows[0], inserted.rows[0].tt_columnname, values[0]);
    expect(inserted.rows[0].tt_columnname === values[0]).to.equal(true);
  });
  it('test select', async () => {
    const id = await model.getId(columns, values); // calls the select() function
    // console.log('got id:', id, typeof id);
    expect(id > 0).to.equal(true);
  });
});
