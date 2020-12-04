#!/bin/bash

# ./data/transform-data/load-data.sh

set -e # exit when any command fails (with the exit status code of the command that failed)
# maybe use DEBUG and EXIT 'traps' to provide better info

echo 'loading covid-tracking states data'
./node_modules/@babel/node/bin/babel-node.js \
  data/load-data/covid-data-load-covid-tracking-states

# exit 0

echo 'loading covid-tracking US data'
./node_modules/@babel/node/bin/babel-node.js \
  data/load-data/covid-data-load-covid-tracking-us


