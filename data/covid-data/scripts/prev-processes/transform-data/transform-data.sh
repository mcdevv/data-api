#!/bin/bash

# ./data/transform-data/transform-data.sh

set -e # exit when any command fails (with the exit status code of the command that failed)
# maybe use DEBUG and EXIT 'traps' to provide better info

echo 'transforming state population'
./node_modules/@babel/node/bin/babel-node.js \
  data/transform-data/transform-covid-data-state-population

#exit 0

echo 'transforming state abbreviations'
./node_modules/@babel/node/bin/babel-node.js \
  data/transform-data/transform-covid-data-state-abbreviations

echo 'transforming state governor party'
./node_modules/@babel/node/bin/babel-node.js \
  data/transform-data/transform-covid-data-governor-political-party
  

