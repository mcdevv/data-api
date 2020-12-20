/* eslint-disable operator-linebreak */
import Debug from 'debug';
import { pool } from './pool.js';

const debug = Debug('app:model');

/**
 * an opinionated database model
 *
 * expects:
 *   col names prefixed with initials of table name: test_table (tt_id, tt_colname)
 *     pass data objects as is, the model will handle the prefixes
 *   all tables have primary key named 'id'
 *   all tables have create_date and modified_date columns
 *   all tables have a unique constraint on one or more non-pk columns
 *   see example table create statements in ./data/test-data/
 * see unit tests in ./test/test-sql-model.test.js
*/

// using a single pool for all instances of model


// for the 'SQL lit' VS Code extension
export const sql = (chunks, ...expr) => chunks
  .map((str, idx) => String(str) + (expr.length > idx ? String(expr[idx]) : ''))
  .join('').trimEnd(); // no changes to the SQL except the ''.trimEnd()

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

// for parameterized queries. ex: 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
function getColumnValuesStringForStmt(values) {
  return values.map((e, i) => `$${i + 1}`).join(',');
}

function getColumnNamesStringForStmt(columns, columnNamePrefix) {
  const columnNames = addColumnNamePrefixToColumnNames(columns, columnNamePrefix);
  const columnNamesString = columnNames.join(',');
  return columnNamesString;
}

function pickValuesFromObj(obj, columns) {
  // sorted by order in columns
  return columns.reduce((acc, cur) => [...acc, obj[cur]], [])
}/* 
const tests = [
  [ 
    [ { date: '20200101', dummy: 1 }, [ 'date' ] ], // args
    [ '20200101' ] // expected results
  ],
  [ 
    [ { date: '20200101', state: 'CO', dummy: 1 }, [ 'date', 'state' ] ], // args
    [ '20200101', 'CO' ] // expected results
  ]
];
tests.forEach(([args,res], i) => {
  console.log({
    ct: ++i,
    args,
    res: pickValuesFromObj(...args),
    expectedRes: res,
  })
}); */

// for update statement set clauses. ex: 'date = $1,state = $2'
function getSetClauseStringForStmt(columns, columnNamePrefix) {
  return columns.map((col, i) => `${columnNamePrefix}_${col} = $${i + 1}`).join(',');
}

// eslint-disable-next-line no-sequences
const log = v => (console.dir(v), v);

// ttd: any use for a generator here?
// ttd: explain why the tn_ prefix
// ttd?: parameterize table names since parameterized Queries / Prepared Statements are formatted on 
//       the server-side, which disallows variables for columns or table names, to counter 
//       SQL injection ... col names, also?
//       https://stackoverflow.com/questions/46062417/how-to-declare-a-string-with-double-quotes-in-query-config-object-in-node-postgr
// create a model class whose constructor accepts the database table we wish to operate on
class Model {
  constructor(tableName, modifiedDateColumnName = 'modified_date') {
    this.pool = pool;
    this.tableName = tableName;
    // ttd: inform user this module requires column names to have this particular prefix
    //      maybe detect which pg error catches an unknown column
    this.columnNamePrefix = getColumnNamePrefix(this.tableName);
    this.modifiedDateColumnName = `${this.columnNamePrefix}_${modifiedDateColumnName}`;
    this.pool.on(
      'error',
      (err, client) => `Error, ${err}, on idle client${client}`
    );
  }

  // before shutting down scripts
  // ... not sure what to do about the testing scripts
  //     each seems to get it's own 
  async endThePool() {
    return this.pool.end();
  }

  // simply run a query as passed
  async runQueryWithReturn(query) {
    return this.pool.query(query); // // return the results as a Promise
  }

  async updateWithReturn(columns, rowObj, uniqueColumns) {
    // eslint-disable-next-line arrow-body-style
    const columnsStartsWithUniqueColumns = uniqueColumns.every((uniqueColumn, idx) => {
      // both the WHERE clause and the SET clause are going to use $1, $2, ... aliases
      //   therefore the uniqueColumns should be (in the same order) the first columns
      //   passed in prameter 'columns'
      return uniqueColumn === columns[idx];
    });
    if (!columnsStartsWithUniqueColumns) {
      throw Error(
        `columns array must begin with uniqueColumns array, in the same order.
         you passed:
         uniqueColumns: ${uniqueColumns}
         columns: ${columns}
        `
      );
    }
    const columnNameValuesString = getSetClauseStringForStmt(columns, this.columnNamePrefix);
    const whereClause = buildWhereClause(uniqueColumns, this.columnNamePrefix);
    const columnNamesString = getColumnNamesStringForStmt(columns, this.columnNamePrefix);
    // if you pass values as parameters, the library's internal formatting provides the correct
    //   escaping for strings as well as all the other JavaScript types
    const stmt = `
          UPDATE ${this.tableName}
          SET ${columnNameValuesString}
             ,${this.modifiedDateColumnName} = CURRENT_TIMESTAMP
          ${whereClause}
          RETURNING ${this.columnNamePrefix}_id, ${columnNamesString}
    `;
    const values = pickValuesFromObj(rowObj, columns);
    debug('update stmt: %s', stmt);
    debug('update values: %O', values);
    return this.pool.query(stmt, values); // return the results as a Promise
  }

  // client.query('insert into mytable values ($1)', ["a value with sing''le quo''te"])
  async insertWithReturn(columns, rowObj) {
    const columnNamesString = getColumnNamesStringForStmt(columns, this.columnNamePrefix);
    const values = pickValuesFromObj(rowObj, columns);
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
    debug('insert stmt: %s', stmt);
    debug('insert values: %O', values);

    return this.pool.query(stmt, values); // return the results as a Promise
  }

  // returns data, not a promise
  async select(columns, clause) {
    const columnNamesString = getColumnNamesStringForStmt(columns, this.columnNamePrefix);
    const stmt =
sql`
SELECT ${columnNamesString} 
FROM ${this.tableName} 
${clause}
LIMIT 10000
`; // if 10000 values returned, notify user?
    debug('select() stmt: %s', stmt);
    // using pool.query, node-postgres executes the query using the first available idle client
    const res = await this.pool.query(stmt); // , this.columnNamePrefix
    debug('select() results: %O', res);
    return stripColumnNamePrefixFromQueryResult(res);
  }

  deleteWithReturn(clause = 'WHERE ya got to supply a where clause lessen I delete everything!') {
    const stmt =
sql`
DELETE
FROM ${this.tableName} 
${clause}
RETURNING *
`;
    debug('deleteWithReturn() stmt: %s', stmt);
    return this.pool.query(stmt); // return the results as a Promise
  }

  // ??? better to ensure length columns matches length values? ... yes
  //     because not looking up a
  async getId(columns, rowObj) {
    const whereClause = buildWhereClause(columns, this.columnNamePrefix);
    const stmt = `SELECT ${this.columnNamePrefix}_id 
                  FROM ${this.tableName} 
                  ${whereClause}`;
    const values = pickValuesFromObj(rowObj, columns);
    const selected = await this.pool.query(stmt, values);
    debug('getId() stmt: %s', stmt);
    debug('getId() results: %O', { columns, rowObj });
    return selected.rows?.[0]?.[`${this.columnNamePrefix}_id`];
  }

  async insertOrUpdate(columnNames, rowObj, uniqueColumns) {
    const idForUniqueColumns = await this.getId(uniqueColumns, rowObj);
    if (idForUniqueColumns) {
      // check if the data has changed
      debug('debug insertOrUpdate(): unique col exists, will update if data is different');
      const id = await this.getId(columnNames, rowObj);
      if (!id) {
        // update, setting the last modified column
        const updatedResult = await this.updateWithReturn(
          columnNames,
          rowObj,
          uniqueColumns
        );
        debug('debug insertOrUpdate(): update result: %O', { updatedResult });
        return updatedResult;
      }
      return { msg: 'no update needed' };
    }
    const insertedResult = await this.insertWithReturn(columnNames, rowObj);
    debug('debug insertOrUpdate(): inserted update: %O', { insertedResult });
    return insertedResult;
  }
}

export { Model };
