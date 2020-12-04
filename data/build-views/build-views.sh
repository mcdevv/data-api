#!/bin/bash

# ./data/build-views/build-views.sh

set -e # exit when any command fails (with the exit status code of the command that failed)
# maybe use DEBUG and EXIT 'traps' to provide better info

#exit 0

echo 'building views'
./node_modules/@babel/node/bin/babel-node.js \
  data/build-views/covid-data-build-views



