


after covid-data: setup good logging maybe with external provider, see my fav article on not using exit()
                  check out sequelize, 

* total the population and add US to the source table
* pull materialized views from those
  * the transform can happen with the view
    * if changes to source data, can build new view then test to be sure have exactly the same results

ttd:
* set up this entire process for test table and data, including a mView and loading from a csv. 
* calc US pop by totalling all jurisdictions
* build view from source data, it won't change
* retire the transforms, just use the mViews
* eventually set up a dev DB ... should the PROD initial data load only from from GAs? what will life be like after PROD goes live? ... hitting prod db while dev a new project?

data prep tasks: (in order, from scratch)
* initial data load
  * create tables (that hold source data exactly as is. helpful to check for changes in old source data)
  * acquire initial data
  * insert data into tables
  * tests
* transform data
  * create the views, in order
    * initial refresh of views

periodic data updates: (depends on how often source data is updated)
* insert new data
  * updating any data that has changed at the source
* refresh the views in order of dependency


partial redos:
* re-build views
* ...

DEV, STAGE, PROD:
* initially, DEV is the default, where I'm working now. env var must be set in order to be in PROD mode
* maybe: all PROD is only run in GAs, so try running everything there, even the initial load and create tables, views
* 



