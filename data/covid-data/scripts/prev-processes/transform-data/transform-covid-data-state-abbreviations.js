import { Model } from '../../src/models/model';

(async () => {
  try {
    const fromTableName = 'covid_data_state_abbreviation_original_source';
    const columns = [ 'state', 'abbreviation' ];
    const toTableName = 'covid_data_state_abbreviation';

    const fromTableModel = new Model(fromTableName);
    const data = await fromTableModel.select(columns);
    const toTableModel = new Model(toTableName);
    // eslint-disable-next-line no-restricted-syntax
    for (const { state, abbreviation } of data.rows) {
      const values = [ state, abbreviation ];
      const id = await toTableModel.getId(columns, values);
      if (!id) {
        console.log('inserting', values, 'in table', toTableName);
        const inserted = await toTableModel.insertWithReturn(columns, values);
      }
    }
  } catch (err) {
    console.error('error:', err.message);
    process.exit(1); // ??? see ttd links in readme to improve the approach
  }
})();
