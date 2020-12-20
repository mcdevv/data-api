ttd:
* testing step before move from load to transform, esp for data from apis
  ... check that modified date not set ... have to look for changes
      test remotely first ..
      check 56 states for current day. check all key fields not null

Covid-tracking API - US total and US states:
* list columns to use (ordered as found in csv)(removing deprecated)
  * note: US historic values - same as State historic values, wrt the 'used fields' below, except for a few state-specific fields missing.
  * fields used:
      * *date*
      * *state* - abbreviation
      * *positive* - confirmed plus probable
      * *positiveIncrease* - new cases; daily increase in API field positive
      * *hospitalizedCurrently* - Currently hospitalized/Now hospitalized; Definitions vary by state / territory. Where possible, we report hospitalizations with `confirmed or probable` COVID-19 cases per the expanded CSTE case definition of April 5th, 2020 approved by the CDC.
      * *hospitalizedCumulative* - Cumulative hospitalized/Ever hospitalized; Definitions vary by state / territory.
      * *hospitalizedIncrease* - new total hospitalizations; Daily increase in hospitalizedCumulative
      * *death* - confirmed or probable, COVID-19 is underlying cause of death
      * *deathIncrease* - new deaths
      * *totalTestResults* - estimate of national testing performance
          * note: careful with any calculation involving this field
          * "At the national level, this metric is a summary statistic which—because it sums figures from states reporting tests in test encounters with those reporting tests in specimens and in people—is `an aggregate calculation of heterogeneous figures`. Therefore, it should be contextualized as, at best, an `estimate` of national testing performance.
      * *totalTestResultsIncrease* US only, not recommended at state/territory leval: Daily increase in totalTestResults, calculated from the previous day’s value. This calculation includes all the caveats associated with Total tests/totalTestResults, and we recommend against using it at the state/territory level.
  * loaded, but not using:
      * dataQualityGrade
      * lastUpdateEt - Date and time in Eastern time the state or territory last updated the data.
          * looks like 'US historic values' at https://covidtracking.com/data/api were copied from the 'State historic values' since it says 'lastModified Field type:string Deprecated. Old label for lastUpdateET.' yet lastUpdateET is not listed there - it is likely more relevant to individual states. 
      * fips
      * 
      * 
      * a
  * deprecated: 
      * *hospitalized - deprecated!!!
  * info about:
      * hospitalizedCumulative - not all states have it
      * positiveCasesViral - IN, KS missing
      * deathConfirmed - CSTE guidlines, many states not available, use 'death'
      * deathProbable - not available in all states
      * 
  * analysis desired:
      * new and total: 
          * cases, 
          * hospitalizations, 
          * deaths, 
          * tests (CDT no longer provide state historical data on tests)
          * *positive rate
          * 
      * per million, absolute, per 100,000
      * rolling 7-day average, no average
      * US ex list of states - phase two if at all
          * therefore, need all calculated fields in the DB ... careful with any derived fields based on population ...
              * may need some calcs on-the-fly ... middleware
      * categories of states: region, governor party, 
      * 
* load raw data
    * test
      * all my states are in the data
      * check which cols missing, PR?
      * 
    * related data to adjust
      * additional 4 territories ... why not just use them now that I have population. red-blue is all that is missing and I have to deal with that for PR anyway
        * nope: they are sketchy with data
    * calculations
      * red-blue: 
        * not all jurisdictions are red-blue ...
    * CSV or API? API (CSV format?) and use CSV for QA?
      * Use our API if you have automated, daily tasks that need to process our data.
      * 
* transform
    * calculated fields:
        * 
* about
  * https://covidtracking.com/data
    * we update all our data each day between about 6pm and 7:30pm Eastern Time.
    * "estimated" -  our national summary Cases, Tests, and Outcomes numbers are simple sums of the data states and territories provide, but because of the disparate metrics they include, they should be considered estimates.
  * https://covidtracking.com/data/api
    * All dates and times are in US eastern time (ET)
    * All URLs in our API, including state codes, should be in lower-case.
    * https://api.covidtracking.com
      * historic US values: https://api.covidtracking.com/v1/us/daily.json
      * historic values for all states: https://api.covidtracking.com/v1/states/daily.json
      * API status: https://api.covidtracking.com/v1/status.json
        * buildTime - string, last time api was built
        * production - boolean, whether this is a production build of the API.
      * plan: ET 7:30 get historic values, see if they change. check status date and prod boolean
    * 
    * 
    * a 
  * https://covidtrackingproject.statuspage.io/
  * https://covidtracking.com/contact
    * Before you contact us - interesting list of things to know
  * https://covidtracking.com/about-data/faq
    * https://covidtracking.com/about-data/faq#why-doesnt-your-data-match-the-data-from-the-cdc-or-worldometer-or-johns-hopkins-or-usafactsorg-or-the-new-york-times-or-another-site
    * https://covidtracking.com/about-data/faq#why-have-you-stopped-reporting-national-cumulative-hospitalizations-icu-and-ventilation-numbers-on-your-website
    * https://covidtracking.com/about-data/faq#how-does-the-testing-data-deal-with-people-who-have-had-multiple-tests-for-covid-19
    * https://covidtracking.com/about-data/faq#why-dont-you-report-test-positivity-rates
    * https://covidtracking.com/about-data/faq#why-dont-you-report-historical-data-on-the-state-pages-any-more
    * https://covidtracking.com/about-data/faq#why-do-you-list-56-states
      * District of Columbia as well as for US territories including American Samoa, Guam, the Mariana Islands, Puerto Rico, and the US Virgin Islands
    * https://covidtracking.com/about-data/faq#what-states-are-included-in-the-regions-you-display-on-your-charts-what-population-figures-do-you-use-for-per-capita-charts
      * Regions displayed in our charts are defined by the US Census. 
      * Population estimates used in per capita charts are also from the [US Census](https://www2.census.gov/geo/pdfs/maps-data/maps/reference/us_regdiv.pdf): we use the [American Community Survey 5-Year Estimates for 2018](https://data.census.gov/cedsci/map?g=0400000US01&tid=ACSDT5Y2018.B01003&vintage=2018&layer=VT_2018_040_00_PP_D1&cid=B01003_001E&mode=thematic) and provide these population values on [GitHub](https://github.com/COVID19Tracking/associated-data).
        * https://github.com/COVID19Tracking/associated-data/tree/master/us_census_data
          * state and county population estimates
    * 
    * a
  * 
  * 
  * 
  * 
  * a