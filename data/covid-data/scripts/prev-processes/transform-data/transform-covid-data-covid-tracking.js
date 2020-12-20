import { Model } from '../../src/models/model';

// combine US and states data into this one table
// selected fields
// date from number to timestamp (for the date-time sql functions)
// add calculated fields
//   per capita using per million - X 10 to get per 100K
//   rolling average ... in client, or middleware
//   ... per million average
(async () => {
  try {
    const fromTableNameUS = 'covid_data_covid_tracking_us_original_source';
    const columns = `
      date 
      positive positiveIncrease 
      hospitalizedCurrently hospitalizedCumulative hospitalizedIncrease
      death deathIncrease 
      totalTestResults totalTestResultsIncrease
    `.split(/[\n\r\t\s]+/);

    const fromTableModelUS = new Model(fromTableNameUS);
    const fromData = await fromTableModelUS.select(
      columns,
      `where cdctuos_create_date > CURRENT_TIMESTAMP - interval '30 days'
       order by cdctuos_date asc
      `
    );





    const toTableName = 'covid_data_covid_tracking';
    const toTableModel = new Model(toTableName);
    // console.log(data);
    // eslint-disable-next-line no-restricted-syntax
    for (const row of fromData) {
      const {
        date, state,
        positive, positiveIncrease,
        hospitalizedCurrently, hospitalizedCumulative, hospitalizedIncrease,
        death, deathIncrease,
        totalTestResults, totalTestResultsIncrease
      } = row;

      // try using postgres to do the calculations ... all of them
      //   even the running average
      //   join with population in a subquery
      //   calculate per capita
      //   can I input query results right into a table, overwriting?
      // objects for each running average
      // testable functions for each calculation
      // in a utils folder in transform-data/utils



      const id = await toTableModel.getId(columns, values);
      // console.log(id);
      if (!id) {
        // console.log('inserting', values, 'in table', toTableName);
        const inserted = await toTableModel.insertWithReturn(columns, values);
      }
    }
  } catch (err) {
    console.error('error:', err.message);
    process.exit(1); // ??? see ttd links in readme to improve the approach
  }
})();
