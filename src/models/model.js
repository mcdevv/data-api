import { pool } from './pool';
// use a single pool for all the models

// pool.query('SELECT * FROM users WHERE id = $1', [1])
// ??? consider pool.end() before shutdown .. may not be necessary

// create a model class whose constructor accepts the database table we wish to operate on
class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on(
      'error',
      (err, client) => `Error, ${err}, on idle client${client}` // ??? idle?
    );
  }

  async select(columns, clause) {
    let query = `SELECT ${columns} FROM ${this.table} `; // whitespace before clause?
    if (clause) query += clause;
    // using pool.query, node-postgres executes the query using the first available idle client
    return this.pool.query(query); // return the results as a Promise
  }

  async insertWithReturn(columns, values) {
    const query = `
          INSERT INTO ${this.table}
          (${columns})
          VALUES
          (${values})
          RETURNING id, ${columns}
      `;
    return this.pool.query(query); // return the results as a Promise
  }
}

export default Model;
