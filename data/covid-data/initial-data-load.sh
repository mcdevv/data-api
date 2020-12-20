#!/bin/bash

# ./data/covid-data/initial-data-load.sh

set -e # exit when any command fails (with the exit status code of the command that failed)
# maybe use DEBUG and EXIT 'traps' to provide better info

#exit 0


echo ''


echo 'INITIAL DATA LOAD'


echo 'create tables'
node --harmony-top-level-await ./data/covid-data/scripts/create-tables


#echo 'download covid-tracking data for US states' ... takes 100 seconds, 22M
#wget https://api.covidtracking.com/v1/states/daily.json -O ./data/covid-data/data-sources/covid-tracking/states.json


exit 0

echo 'insert state metadata'
#node --harmony-top-level-await ./data/covid-data/scripts/load-state-metadata-local-files


echo 'insert covid-tracking US data'
#node --harmony-top-level-await ./data/covid-data/scripts/load-covid-tracking-us-data


echo 'insert covid-tracking data for US states'
node --harmony-top-level-await ./data/covid-data/scripts/load-covid-tracking-states-data.js


exit 0

echo 'TRANSFORM DATA'
echo 'create views with initial refresh'
node --harmony-top-level-await \
  ./data/covid-data/scripts/create-views

echo 'TEST INITIAL DATA LOAD'
node --harmony-top-level-await \
  ./data/covid-data/scripts/test-initial-data-load

echo ''



