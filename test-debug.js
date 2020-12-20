/* eslint-disable max-len */
/* eslint-disable import/newline-after-import */

// DEBUG=http ./node_modules/@babel/node/bin/babel-node.js ./test-debug

import Debug from 'debug';
const debug = Debug('http');
debug('booting %o', 'my App');
// DEBUG=http node test-debug.mjs
// DEBUG=http ./node_modules/@babel/node/bin/babel-node.js ./test-debug
// ... wildcard causes no debug messages if you have 'http' only. you'd http:a, http:b or no messages at all ...
//     DEBUG=http:* ./node_modules/@babel/node/bin/babel-node.js ./test-debug

// import Debug from 'debug';
// const debug = Debug('');
// DEBUG=* ./node_modules/@babel/node/bin/babel-node.js ./test-debug

// const debug = require('debug')('http');
// debug('booting %o', 'my App');
// DEBUG=http node test-debug.js

// import debug from 'debug';
// DEBUG=* ./node_modules/@babel/node/bin/babel-node.js ./test-debug
// debug('')('test debug');

// Formatters: j, o, s
//       plus:
//            %O - pretty-print Obj on multiple lines
//            %d - numbers
//            %%
const multilineTemplateLiteral = `multline
template ${''}literal string`
debug('template literal multiline %s', multilineTemplateLiteral);
