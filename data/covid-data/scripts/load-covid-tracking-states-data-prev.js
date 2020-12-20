// node --harmony-top-level-await ./data/covid-data/scripts/load-covid-tracking-states-data-prev.js
// package to stream JSON from a URL: https://github.com/dominictarr/JSONStream
import fs from 'fs';
import chain from 'stream-chain';
import parser  from 'stream-json';
import streamArray from 'stream-json/streamers/StreamArray.js';
// more stuff in the stream-json package
// const {pick}   = require('stream-json/filters/Pick');
// const {ignore} = require('stream-json/filters/Ignore');
// const {streamValues} = require('stream-json/streamers/StreamValues');

const pipeline = new chain([
  // The default value for encodings is null, which is equivalent to 'utf8'
  fs.createReadStream('./data/covid-data/data-sources/covid-tracking/states.json'),
  parser(),
  new streamArray(),
  // data => {
  //   console.log(data[0]);
  //   return data;
  // }
]);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

for await (const chunk of pipeline) {
  console.log(chunk);
  console.log();
  console.log();
  console.log();
  await sleep(3000);
}
/* do the worker thing: https://ckhconsulting.com/parsing-large-json-with-nodejs/
grab 30, give ten to each, then grab another 30
postgres may have a way to get a connection and then
 i could let it ask for more ...
 search multiple node database inserts
 */
/* (async () => {
  try {
    pipeline.on('data', async ({ key, value }) => {
      console.log(key, value.date);
      await sleep(1000);
      // throw Error();
    });
    // pipeline.on('end', () => console.log(`The accounting department has ${counter} employees.`));
    // on 'error', too
  } catch (err) {
    process.exit(1);
  }
})(); */
