import { Model } from '../../src/models/model';

(async () => {
  try {
    const model = new Model('test_table');
    const columns = ['columnName'];
    const values = [Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()];

    const inserted = await model.insertWithReturn(columns, values);
    console.log('inserted', inserted.rows);

    const id = await model.getId(columns, values);
    console.log('get id:', id);

    // next: test delete function
  } catch (err) {
    console.log('error:', err.message);
    // process.exit(1); // ??? see ttd links in readme to improve the approach
  }
})();
