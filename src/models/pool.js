import { Pool } from 'pg';
import dotenv from 'dotenv';
import { connectionString } from '../settings';
// ??? 5 concurrent connections on the free plan
dotenv.config();
const pool = new Pool({ connectionString });
// pool.connect().then(() => console.log('pg pool connected')); - pool.connect not needed of only pool.query

// in node-postgres, every query is executed by a client.
// a pool is a collection of clients for communicating with the database
// console.log(pool);
export { pool };
