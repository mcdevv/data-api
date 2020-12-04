import { Model } from '../../src/models/model';

(async () => {
  try {
    const fromTableName = 'covid_data_state_population_original_source';
    const columns = [ 'state', 'population' ];
    const toTableName = 'covid_data_state_population';

    const fromTableModel = new Model(fromTableName);
    const fromData = await fromTableModel.select(columns);

    // convert population, a comma-delimited String, to a Number
    const data = fromData.rows.reduce((acc, { state, population }) => {
      acc.push({ state, population: Number(population.replace(/,/g, '')) });
      return acc;
    }, []);

    // calculate the population of the US as a total of the states and districts in the data set
    data.push({
      state: 'United States',
      population: Object.values(data).reduce((acc, cur) => acc + cur.population, 0)
    });
    // the territories: AS, GU, MP, VI found in the covid-tracking US data
    // (presumably, data lists 56 states and these four are in states data
    // but not included other meta data available)
    // + 168485 // Guam
    // + 106235 // Virgin Islands ... territory numbers from Wikipedia (CIA world factbook)
    // + 51433  // Northern Mariana Islands MP
    // + 49437  // America Samoa ... https://en.wikipedia.org/wiki/List_of_states_and_territories_of_the_United_States_by_population

    const toTableModel = new Model(toTableName);
    // console.log(data);
    // eslint-disable-next-line no-restricted-syntax
    for (const { state, population } of data) {
      const values = [ state, population ];
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
