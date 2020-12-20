import fetch from 'node-fetch';
import { Model } from '../../src/models/model';

// eslint-disable-next-line no-sequences
const log = v => (console.dir(v), v);

(async () => {
  try {
    const dataSourceUrl = 'https://api.covidtracking.com/v1/us/daily.json';
    const response = await fetch(dataSourceUrl);
    const content = await response.json();

    log({ content: content[0] });

    const tableName = 'covid_data_covid_tracking_us_original_source';
    const model = new Model(tableName);
    // get all column names in the json
    const columnNames = Object.keys(content[0]);

    log({ columnNames });

    // eslint-disable-next-line no-restricted-syntax
    for (const rowObj of content) {
      // check if record already exists for this date
      const uniqueColumns = [ 'date' ];
      const idForDate = await model.getId(uniqueColumns, rowObj);
      if (idForDate) {
        // check if the data has changed
        const id = await model.getId(columnNames, rowObj);
        if (id) {
          // update, setting the last modified column
          // ttd: unit tests for update using test table
          const updated = await model.updateWithReturn(
            columnNames,
            rowObj,
            uniqueColumns
          );
          log({ updated });
        }
      } else {
        console.log('about to insert', columnNames, rowObj);
        const inserted = await model.insertWithReturn(columnNames, rowObj);
        console.log('inserted', inserted.rows);
        // break;
      }
    }
  } catch (err) {
    console.log('error:', err.message);
    process.exit(1); // ??? see ttd links in readme to improve the approach
  }
})();
