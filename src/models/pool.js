import { Pool } from 'pg';
import { connectionString } from '../settings';
// import dotenv from 'dotenv';
// dotenv.config(); // may need if need to us PORT in .env for a custom port ...

// ??? 5 concurrent connections on the free plan
const pool = new Pool({ connectionString });
// pool.connect().then(() => console.log('pg pool connected')); - pool.connect not needed if using only pool.query

// in node-postgres, every query is executed by a client
// a pool is a collection of clients for communicating with the database
// console.log(pool);

export { pool };
