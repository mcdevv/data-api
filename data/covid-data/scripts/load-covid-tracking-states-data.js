/* eslint-disable no-restricted-syntax */
// node --harmony-top-level-await ./data/covid-data/scripts/load-covid-tracking-states-data-prev.js
// package to stream JSON from a URL: https://github.com/dominictarr/JSONStream
import fs from 'fs';
import chain from 'stream-chain';
import parser  from 'stream-json';
import streamArray from 'stream-json/streamers/StreamArray.js';
import { Model } from '../../../src/models/model.js';
import { debug } from './setup.js';
import { arrayToGroupsOf } from '../../utils/misc.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const tableName = 'covid_data_covid_tracking_states_original_source';
const model = new Model(tableName);

try {
  const pipeline = new chain([
    fs.createReadStream(
      './data/covid-data/data-sources/covid-tracking/states.json',
      { encoding: 'utf8' } // The default value for encodings is null, which is equivalent to 'utf8'
    ),
    parser(),
    new streamArray(),
    // data => {
    //   console.log(data);
    //   return data;
    // }
  ]);

  const numAvailableDBConnections = 3; // ttd: put in .env
  debug('numAvailableDBConnections:', numAvailableDBConnections);
  const numItemsPerGroup = 100;
  debug('numItemsPerGroup:', numItemsPerGroup);
  const numItemsToProcessAtOnce = numItemsPerGroup * numAvailableDBConnections;
  debug('numItemsToProcessAtOnce:', numItemsToProcessAtOnce);

  // async func will await DB API call for each group item
  const insertGroup = async (columnNames, items, groupNum) => {
    debug('insertGroup %s, before looping', groupNum);
    // eslint-disable-next-line no-restricted-syntax
    for (const [ct, item] of Object.entries(items)) {
      try {
        const inserted = await model.insertWithReturn(columnNames, item);
        // debug('inserted: %O', inserted.rows);
        debug('inserting row %s of group %s', Number(ct) + 1, groupNum);
      } catch (err) {
        debug('catch API rejection:', err);
        // Promise.all returns as soon as one of its promises rejects
        return Promise.reject(err);
      }
    }
    return `${items.length} items inserted`;
  };

  // make this async so that we can await it in the main loop
  const insertGroups = async (rows, columnNames) => {
    const groups = arrayToGroupsOf(rows, numItemsPerGroup);
    debug('about to process %s groups of max %s rows', groups.length, groups[0].length);
    // await the completion of all groups
    const all = await Promise.all(
      groups.map((group, idx) => insertGroup(columnNames, group, idx))
    ).catch(err => {
      console.log('error: one of the Promise.all promises rejected, throw:', err);
      throw new Error('error: Promise.all catch:', err);
    });
    rows = [];
    debug('result of Promise.all: %O', all);
    process.exit(1);
  }

  // process the data in sets of numItemsToProcessAtOnce
  let rows = [];
  let columnNames = [];

  // for/await/of turns pipeline into an (async?) iterable
  //   without 'await': TypeError: pipeline is not iterable
  for await (const { key: rowNum, value: row } of pipeline) {
    // if (rowNum > 40) continue;
    if (rowNum === 0) {
      columnNames = Object.keys(row);
      debug('sample data row: %O', row);
    };
    rows.push(row);
    console.log(rows.length);
    if (rows.length === numItemsToProcessAtOnce) {
      console.log('about to insert %s rows: ', rows.length);
      await insertGroups(rows, columnNames);
      rows = [];
      await sleep(2000);
      // break;
    }
  }








  // wow, idle connections are hung ... they dropped when I killed the shell ...
  //   was it my ctrl-c ... nope, tried it intentionally
  //   was it the throw? nope
  //   can't reproduce ... aaah, that one I couldn't ctrl-c
  //     try ctrl-c during different pRts of the process, or ctrl-|
  //   how to detect this and restart the GA shell?
  //     query DB for num connections and how long idle
  //     watch OS for hung processes 
  //   ps -ef; how to notice and kill any hung node process
  // wow, group 0 slow ran its final 20 after the others done

  // read on events for inter-object communication
  //   stRt here: https://www.freecodecamp.org/news/understanding-node-js-event-driven-architecture-223292fcbc2d/
  






  // ttd: how to detect the last item in the stream inside the for/await/of loop
  if (rows.length > 0) await insertGroups(rows, columnNames);

  debug('about to end the pool');
  await model.endThePool();
} catch (err) {
  console.log('error:', err.message);
  debug('error, about to end the pool');
  await model.endThePool();
  process.exit(1);
}

// test: will the throw bubble up to my try/catch here?
//       how: omit create tables before running this (insert-only) script again
// ttd: it may be better to store the insert that failed and log it, 
//      instead of shutting the whole thing down ... but I want it to
//      shut down, so that the views never get refreshed ... with a missing
//      row? that's not helpful.
