import { pool } from '../models/pool';
import {
  insertMessages,
  createMessageTable,
  dropMessagesTable,
} from './queries';

export const executeQueryArray = async arr => new Promise(resolve => {
  const stop = arr.length;
  arr.forEach(async (q, index) => {
    // ??? use up all the clients in the pool before awaiting
    await pool.query(q); // ??? awaiting each query too slow in production?
    if (index + 1 === stop) resolve();
  });
});

// disable at some point???
export const dropTables = () => executeQueryArray([ dropMessagesTable ]);

export const createTables = () => executeQueryArray([ createMessageTable ]);
export const insertIntoTables = () => executeQueryArray([ insertMessages ]);
