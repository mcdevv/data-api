import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';

// ttd: cacheing? AND maybe: reverse proxy cache:
//      https://expressjs.com/en/advanced/best-practice-performance.html#use-a-reverse-proxy
// maybe: put apache in front of this server to serve static files, if many

const dirname = process.cwd();
const staticPublicRouter = express.Router();

const serveStaticOptions = {
  index: false,
  // extensions: [ 'csv' ], // unless can auto add .csv to downloaded file, 
  //   this is counter-productive
  // startdev hangs in Chrome, not FF ... start does not ... test OK ...
  //   therefore, considering 'serve all files as downloads' here: 
  //     http://expressjs.com/en/resources/middleware/serve-static.html
  // 
};
const staticFilePaths = [
  '/data/covid-data/static-public',
  '/data/covid-data/ballotpedia/static-public',
  '/data/covid-data/census-gov/static-public',
];

// eslint-disable-next-line no-restricted-syntax
for (const staticFilePath of staticFilePaths) {
  const fullStaticFilePath = path.join(dirname, staticFilePath);
  staticPublicRouter.use(serveStatic(fullStaticFilePath, serveStaticOptions));
}

export { staticPublicRouter };
