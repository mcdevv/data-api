import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';

import {
  indexRouter,
  staticPublicRouter,
  tableToJsonRouter,
} from './routes/index.js';

// const bodyParser = require('body-parser'); see js-vocab api for usage

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// may be perf benefit if static routes come first, yes, esp in startdev
app.use('/v1/static', staticPublicRouter);
app.use('/v1/table-to-json', tableToJsonRouter);
app.use('/v1', indexRouter); // ttd: perf and order of routers
if (process.env.DEBUG === 'express:*') {
  console.log('endpoints', listEndpoints(app));
}
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.stack });
});

export default app;
