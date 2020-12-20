#!/bin/bash

# ./data/test-data/initial-data-load.sh

set -e # exit when any command fails (with the exit status code of the command that failed)
# maybe use DEBUG and EXIT 'traps' to provide better info

#exit 0

echo ''

echo 'INITIAL DATA LOAD'
echo 'create tables'
./node_modules/@babel/node/bin/babel-node.js \
  ./data/test-data/create-tables
echo 'insert data into tables'
./node_modules/@babel/node/bin/babel-node.js \
  ./data/test-data/load-test-data

echo 'TRANSFORM DATA'
echo 'create views with initial refresh'
./node_modules/@babel/node/bin/babel-node.js \
  ./data/test-data/create-views

echo 'TEST INITIAL DATA LOAD'
./node_modules/@babel/node/bin/babel-node.js \
  ./data/test-data/test-initial-data-load

echo ''



