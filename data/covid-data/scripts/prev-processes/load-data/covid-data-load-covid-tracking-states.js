import fetch from 'node-fetch';
import { Model } from '../../src/models/model';

(async () => {
  try {
    const dataSourceUrl = 'https://api.covidtracking.com/v1/states/daily.json';
    const response = await fetch(dataSourceUrl);
    const content = await response.json();

    console.log(content[0]);

    const tableName = 'covid_data_covid_tracking_states_original_source';
    const model = new Model(tableName);
    const columns = Object.keys(content[0]);

    console.log(columns);

    // const testContent = content.slice(0, 3);
    // eslint-disable-next-line no-restricted-syntax
    for (const e of content) { // .slice(0, 30 * 56 + 1)
      const values = Object.values(e);
      const id = await model.getId(columns, values);
      // want to know how often data changes ... so ...
      // check if the columns the date-state unique constraint enforces
      // exist, then check the full data set for changes
      if (!id) {
        console.log('about to insert', columns, values);
        const inserted = await model.insertWithReturn(columns, values);
        console.log('inserted', inserted.rows);
        // break;
      }
    }
  } catch (err) {
    console.log('error:', err.message);
    process.exit(1); // ??? see ttd links in readme to improve the approach
  }
})();
/*
tests:

-- expect 56 rows for each date:
select cdctsos_date, count(*)
from covid_data_covid_tracking_states_original_source
group by cdctsos_date
order by cdctsos_date





*/