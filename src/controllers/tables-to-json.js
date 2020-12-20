import { Model } from '../models/model.js';
// ttd: look at sequelize.org
const tablesToColumns = new Map([
  [ 'covid_data_state_abbreviation_original_source', [ 'state', 'abbreviation' ] ],
  [ 'covid_data_state_governor_political_party_original_source', [ 'state', 'party' ] ],
  [ 'covid_data_state_population_original_source', [ 'state', 'population' ] ],
  [ 'covid_data_state_abbreviation', [ 'state', 'abbreviation' ] ],
  [ 'covid_data_state_governor_political_party', [ 'state', 'party' ] ],
  [ 'covid_data_state_population', [ 'state', 'population' ] ],
]);

export const tableToJson = (table) => async (req, res) => {
  try {
    // console.log(`about to query table: ${table}`);
    const tableModel = new Model(table);
    const data = await tableModel.select(tablesToColumns.get(table));
    // console.log(`done query table: ${table}`);
    res.status(200).json(data.rows);
  } catch (err) {
    res.status(500).json({ error: err });
    // ttd: trigger error here for test coverage. 200?
  }
};

/*
export const addMessage = async (req, res) => {
  const { name, message } = req.body;
  const columns = 'name, message';
  const values = `'${name}', '${message}'`;
  try {
    const data = await messagesModel.insertWithReturn(columns, values);
    res.status(200).json({ messages: data.rows });
  } catch (err) {
    res.status(200).json({ messages: err.stack });
  }
}; */
