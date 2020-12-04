import { pool } from './pool';

// use a single pool for all the models

// ??? consider pool.end() before shutdown

// column names are prefixed with a string consisting of the first
// initial of each word in the table name followed by '_'
// ex: if table name is table_name, the 'id' column would be named tn_id
function getColumnNamePrefix(tableName = '') {
  const words = tableName.split('_');
  return words.map(e => e.charAt(0)).join('');
}

function addColumnNamePrefixToColumnNames(columnNames, columnNamePrefix) {
  return columnNames.map(e => `${columnNamePrefix}_${e}`);
}

function stripColumnNamePrefixFromQueryResult(data, columnNamePrefix) {
  // console.log(data);
  // no-param-reassign last step before data is sent to the client
  // eslint-disable-next-line no-param-reassign
  data.rows = data.rows.map(row => {
    const rowObj = {};
    Object.keys(row).forEach(key => {
      const regexp = new RegExp(`^${columnNamePrefix}_`);
      const newKey = key.replace(regexp, '');
      rowObj[newKey] = row[key];
    });
    return rowObj;
  });
  return data;
}

function buildWhereClause(columns, columnNamePrefix) {
  const columnConditions = columns
    .map((e, i) => `${columnNamePrefix}_${e} = $${i + 1}`)
    .join(' and ');
  return `where ${columnConditions}`;
}

// parameterized queries. ex: 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
function getColumnValuesStringForStmt(values) {
  return values.map((e, i) => `$${i + 1}`).join(',');
}

function getColumnNamesStringForStmt(columns, columnNamePrefix) {
  const columnNames = addColumnNamePrefixToColumnNames(columns, columnNamePrefix);
  const columnNamesString = columnNames.join(',');
  return columnNamesString;
}

// ttd: any use for a generator here?
// ttd: explain why the tn_ prefix
// ttd?: parameterize table names since parameterized Queries / Prepared Statements are formatted on 
//       the server-side, which disallows variables for columns or table names, to counter 
//       SQL injection ... col names, also?
//       https://stackoverflow.com/questions/46062417/how-to-declare-a-string-with-double-quotes-in-query-config-object-in-node-postgr
// create a model class whose constructor accepts the database table we wish to operate on
class Model {
  constructor(tableName) {
    this.pool = pool;
    this.tableName = tableName;
    this.pool.on(
      'error',
      (err, client) => `Error, ${err}, on idle client${client}` // ??? idle?
    );
    this.columnNamePrefix = getColumnNamePrefix(this.tableName);
    // ???Model.getColumnNamePrefix works but won't work for inherited classes
    //   note this issue wrt static methods only
  }

  // simply run a query as passed
  async runQueryWithReturn(query) {
    return this.pool.query(query);
  }

  // ttd: auto string escaping via 
  // client.query('insert into mytable values ($1)', ["a value with sing''le quo''te"])
  async insertWithReturn(columns, values) {
    const columnNamesString = getColumnNamesStringForStmt(columns, this.columnNamePrefix);
    const columnValuesString = getColumnValuesStringForStmt(values);
    // if you pass values as parameters, the library's internal formatting provides the correct
    //   escaping for strings as well as all the other JavaScript types
    const stmt = `
          INSERT INTO ${this.tableName}
          (${columnNamesString})
          VALUES
          (${columnValuesString})
          RETURNING ${this.columnNamePrefix}_id, ${columnNamesString}
      `;
    // console.log('insert stmt:', stmt, values);
    return this.pool.query(stmt, values); // return the results as a Promise
  }

  async select(columns, clause) {
    const columnNamesString = getColumnNamesStringForStmt(columns, this.columnNamePrefix);
    const stmt = `SELECT ${columnNamesString} 
                  FROM ${this.tableName} 
                  ${clause}
                  LIMIT 10000`;
    // console.log('select stmt:', stmt);
    // using pool.query, node-postgres executes the query using the first available idle client
    return stripColumnNamePrefixFromQueryResult(await this.pool.query(stmt), this.columnNamePrefix);
  }

  async getId(columns, values) {
    const whereClause = buildWhereClause(columns, this.columnNamePrefix);
    const stmt = `SELECT ${this.columnNamePrefix}_id 
                  FROM ${this.tableName} 
                  ${whereClause}`;
    const selected = await this.pool.query(stmt, values);
    // console.log('select stmt:', stmt, values);
    return selected.rows?.[0]?.[`${this.columnNamePrefix}_id`];
  }
}

export { Model };
