#!/bin/bash

# if errors, first try running initial-data-load.sh again

# DEBUG=model:* ./data/test-data/periodic-data-load.sh

set -e # exit when any command fails (with the exit status code of the command that failed)
# consider use DEBUG and EXIT 'traps' to provide better info

#exit 0

echo ''

echo 'PERIODIC DATA LOAD'
echo 'update data into tables'
./node_modules/@babel/node/bin/babel-node.js \
  ./data/test-data/update-test-data

echo 'REFRESH MATERIALIZED VIEW'
./node_modules/@babel/node/bin/babel-node.js \
  ./data/test-data/refresh-views

echo 'TEST PERIODIC DATA LOAD'
./node_modules/@babel/node/bin/babel-node.js \
  ./data/test-data/test-periodic-data-load

echo ''



