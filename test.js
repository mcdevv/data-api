// node --harmony-top-level-await test.js
/* eslint-disable no-restricted-syntax */
import * as fs from 'fs';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const readable = fs.createReadStream('./data/covid-data/data-sources/covid-tracking/states.json', 
{ encoding: 'utf8' });

for await (const chunk of readable) {
  console.log(chunk);
  console.log();
  console.log();
  console.log();
  await sleep(3000);
}
/* 
async function logChunks(readable) {
  for await (const chunk of readable) {
    console.log(chunk);
    console.log();
    console.log();
    console.log();
    await sleep(3000);
  }
}
logChunks(readable);
 */