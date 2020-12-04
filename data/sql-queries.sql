


--  rebuild each day from scratch, but have to overwrite or move tables, refresh views

-- 
-- per million
-- average of each, incdluing per million
-- per 100K just a query
-- wow ... just let the db do it and provide an endpoint that maps to query
-- cacheing common queries ... 

https://www.postgresqltutorial.com/postgresql-materialized-views/
https://stackoverflow.com/questions/29437650/how-can-i-ensure-that-a-materialized-view-is-always-up-to-date

what I was doing might be called a rollup table - can be more efficient
than MVs S you only deal with new data ... just create a secondary table
and add any changed data into it. insert into rollup_table select xyz from source_table


With CONCURRENTLY option, PostgreSQL creates a temporary updated version 
of the materialized view, compares two versions, and performs INSERT and UPDATE 
only the differences. You can query against the materialized view while it is 
being updated. One requirement for using CONCURRENTLY option is that the 
materialized view must have a UNIQUE index. Notice that CONCURRENTLY 
option is only available from PosgreSQL 9.4.

it should only ad one day of data, quick
however, if there is a huge redo of old data ...

"REFRESH MATERIALIZED VIEW CONCURRENTLY takes an EXCLUSIVE lock" on the (source) table. Following the crumb trail to documentation we can read that an EXCLUSIVE lock on a table "allows only concurrent ACCESS SHARE locks, i.e., only reads from the table can proceed". In the same paragraph we can see that "EXCLUSIVE conflicts with ... EXCLUSIVE", meaning that another REFRESH MATERIALIZED VIEW CONCURRENTLY statement, which requests the same EXCLUSIVE lock, will have to wait until the earlier EXCLUSIVE lock is released.
If you want to avoid waiting for this lock for an undefined period, 
you may want to set the session variable lock_timeout to a sensible value.


--select * from covid_data_state_abbreviation;
--select * from covid_data_state_governor_political_party;
--select * from covid_data_state_population;
-- covid_data_meta_data
--select * from covid_data_state_metadata

-- drop cascade ... dependent objects ... need to set up a script to run via node
DROP MATERIALIZED VIEW IF EXISTS covid_data_state_metadata;
CREATE MATERIALIZED VIEW covid_data_state_metadata AS
  SELECT cdsa_state AS cdmd_state,
         cdsa_abbreviation AS cdmd_abbreviation,
         cdsgpp_party AS cdmd_governor_party,
         CAST (cdsp_population AS NUMERIC) AS cdmd_population,
         CAST (cdsp_population AS NUMERIC) / 1000000 AS cdmd_population_millions
  FROM covid_data_state_abbreviation
    INNER JOIN covid_data_state_population ON (cdsa_state = cdsp_state)
    LEFT OUTER JOIN covid_data_state_governor_political_party ON (cdsa_state = cdsgpp_state)
  UNION
  SELECT NULL AS cdmd_state,
         alias.state AS cdmd_abbreviation,
         NULL AS cdmd_governor_party,
         alias.population AS cdmd_population
  FROM (
    SELECT CASE
            WHEN cdsgpp_party = 'Democratic' THEN 'D1'
            WHEN cdsgpp_party = 'Republican' THEN 'R1'
          END AS state
          ,sum(cdsp_population) AS population
    FROM covid_data_state_governor_political_party
      INNER JOIN covid_data_state_population ON (cdsgpp_state = cdsp_state)
    WHERE cdsgpp_party in ('Democratic','Republican')
    GROUP BY cdsgpp_party
  ) as alias
  ORDER BY cdsa_state desc

plan:
* finish main materialized view for states
* set up refresh
* try this new stuff via GAs



-- Run in order:

DROP MATERIALIZED VIEW IF EXISTS covid_data_covid_tracking;

CREATE MATERIALIZED VIEW covid_data_covid_tracking
AS
  SELECT cdctuos_date AS cdct_date
        ,'US' AS cdct_state
        ,cdctuos_positive AS cdct_positive
        ,cdctuos_positive / cdmd_population_millions AS cdct_positive_per_million
        ,cdctuos_positiveIncrease AS cdct_positive_increase
        ,cdctuos_positiveIncrease / cdmd_population_millions AS cdct_positive_increase_per_million
        ,cdctuos_hospitalizedCurrently AS cdct_hospitalized_currently
        ,cdctuos_hospitalizedCurrently / cdmd_population_millions AS cdct_hospitalized_currently_per_million
        ,cdctuos_hospitalizedCumulative AS cdct_hospitalized_cumulative
        ,cdctuos_hospitalizedCumulative / cdmd_population_millions AS cdct_hospitalized_cumulative_per_million
        ,cdctuos_hospitalizedIncrease AS cdct_hospitalized_increase
        ,cdctuos_hospitalizedIncrease / cdmd_population_millions AS cdct_hospitalized_increase_per_million
        ,cdctuos_death AS cdct_death
        ,cdctuos_death / cdmd_population_millions AS cdct_death_per_million
        ,cdctuos_deathIncrease AS cdct_death_increase
        ,cdctuos_deathIncrease / cdmd_population_millions AS cdct_death_increase_per_million
        ,cdctuos_totalTestResults AS cdct_total_test_results
        ,cdctuos_totalTestResults / cdmd_population_millions AS cdct_total_test_results_per_million
        ,cdctuos_totalTestResultsIncrease AS cdct_total_test_results_increase
        ,cdctuos_totalTestResultsIncrease / cdmd_population_millions AS cdct_total_test_results_increase_per_million
        ,NULL AS cdct_data_quality_grade
        ,cdctuos_lastModified AS cdct_last_update_et -- API says deprecated, but looks like boilerplate from the state API docs
  FROM covid_data_covid_tracking_us_original_source
    INNER JOIN covid_data_state_metadata ON 'US' = cdmd_abbreviation
  UNION
  SELECT cdctsos_date AS cdct_date
        ,cdctsos_state AS cdct_state
        ,cdctsos_positive AS cdct_positive
        ,cdctsos_positive / cdmd_population_millions AS cdct_positive_per_million
        ,cdctsos_positiveIncrease AS cdct_positive_increase
        ,cdctsos_positiveIncrease / cdmd_population_millions AS cdct_positive_increase_per_million
        ,cdctsos_hospitalizedCurrently AS cdct_hospitalized_currently
        ,cdctsos_hospitalizedCurrently / cdmd_population_millions AS cdct_hospitalized_currently_per_million
        ,cdctsos_hospitalizedCumulative AS cdct_hospitalized_cumulative
        ,cdctsos_hospitalizedCumulative / cdmd_population_millions AS cdct_hospitalized_cumulative_per_million
        ,cdctsos_hospitalizedIncrease AS cdct_hospitalized_increase
        ,cdctsos_hospitalizedIncrease / cdmd_population_millions AS cdct_hospitalized_increase_per_million
        ,cdctsos_death AS cdct_death
        ,cdctsos_death / cdmd_population_millions AS cdct_death_per_million
        ,cdctsos_deathIncrease AS cdct_death_increase
        ,cdctsos_deathIncrease / cdmd_population_millions AS cdct_death_increase_per_million
        ,cdctsos_totalTestResults AS cdct_total_test_results
        ,cdctsos_totalTestResults / cdmd_population_millions AS cdct_total_test_results_per_million
        ,cdctsos_totalTestResultsIncrease AS cdct_total_test_results_increase
        ,cdctsos_totalTestResultsIncrease / cdmd_population_millions AS cdct_total_test_results_increase_per_million
        ,cdctsos_grade AS cdct_data_quality_grade
        ,cdctsos_lastUpdateEt AS cdct_last_update_et -- API says deprecated, but looks like boilerplate from the state API docs
  FROM covid_data_covid_tracking_states_original_source
    INNER JOIN covid_data_state_metadata ON cdctsos_state = cdmd_abbreviation
  UNION
  SELECT cdctsos_date AS cdct_date
        ,CASE
           WHEN cdmd_governor_party = 'Democratic' THEN 'DM'
           WHEN cdmd_governor_party = 'Republican' THEN 'RP'
         END AS cdct_state
        ,cdctsos_positive AS cdct_positive
        ,cdctsos_positive / cdmd_population_millions AS cdct_positive_per_million
        ,cdctsos_positiveIncrease AS cdct_positive_increase
        ,cdctsos_positiveIncrease / cdmd_population_millions AS cdct_positive_increase_per_million
        ,cdctsos_hospitalizedCurrently AS cdct_hospitalized_currently
        ,cdctsos_hospitalizedCurrently / cdmd_population_millions AS cdct_hospitalized_currently_per_million
        ,cdctsos_hospitalizedCumulative AS cdct_hospitalized_cumulative
        ,cdctsos_hospitalizedCumulative / cdmd_population_millions AS cdct_hospitalized_cumulative_per_million
        ,cdctsos_hospitalizedIncrease AS cdct_hospitalized_increase
        ,cdctsos_hospitalizedIncrease / cdmd_population_millions AS cdct_hospitalized_increase_per_million
        ,cdctsos_death AS cdct_death
        ,cdctsos_death / cdmd_population_millions AS cdct_death_per_million
        ,cdctsos_deathIncrease AS cdct_death_increase
        ,cdctsos_deathIncrease / cdmd_population_millions AS cdct_death_increase_per_million
        ,cdctsos_totalTestResults AS cdct_total_test_results
        ,cdctsos_totalTestResults / cdmd_population_millions AS cdct_total_test_results_per_million
        ,cdctsos_totalTestResultsIncrease AS cdct_total_test_results_increase
        ,cdctsos_totalTestResultsIncrease / cdmd_population_millions AS cdct_total_test_results_increase_per_million
        ,cdctsos_grade AS cdct_data_quality_grade
        ,cdctsos_lastUpdateEt AS cdct_last_update_et -- API says deprecated, but looks like boilerplate from the state API docs
  FROM covid_data_covid_tracking_states_original_source
    INNER JOIN covid_data_state_metadata ON cdctsos_state = cdmd_abbreviation
  ORDER BY 1 desc, 2 asc
WITH NO DATA
-- can't query view until the initial data load is complete

-- in order to refresh concurrently at least one index is needed
CREATE UNIQUE INDEX cdct_date_state_idx_unique ON covid_data_covid_tracking (cdct_date, cdct_state);

REFRESH MATERIALIZED VIEW covid_data_covid_tracking; -- first time without CONCURRENTLY

select * from covid_data_covid_tracking;

REFRESH MATERIALIZED VIEW CONCURRENTLY covid_data_covid_tracking;





next:
* plan how to add columns to the view without downtime
  create and then rename? 
* getId not working I think .. ah, the data has changed
  just update the table with modified if data has changed
  note: each time change table or add cols, need to drop and start over
* load all states data
* use stmts to test data from the us and states tables
* write a MV query
  * add date as timestamp later if needed. for now as a number is great
* route endpoints to query the MV
* get the queries and explain plan to discover indexes needed
* use in the front-end app ... cacheing?

SELECT cdctuos_date, 
       cdctuos_hospitalizedCurrently,
       cdctuos_hospitalizedCurrently / (7000000 / 1000000) as hospitalized_currenty_per_million
FROM covid_data_covid_tracking_us_original_source
where cdctuos_hospitalizedCurrently is NOT null
  and cdctuos_hospitalizedCurrently > 0
ORDER BY cdctuos_date


SELECT cdctuos_date, 
       cdctuos_hospitalizedCurrently,
       AVG(cdctuos_hospitalizedCurrently) OVER(
         ORDER BY cdctuos_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS hospitalized_currently_rolling_7day_average
FROM covid_data_covid_tracking_us_original_source
where cdctuos_hospitalizedCurrently is NOT null
  and cdctuos_hospitalizedCurrently > 0
ORDER BY cdctuos_date
-- one column at a time so sequence starts on the first non 0 date
-- note: denominator is the number of rows if less than 7
-- plan: pg provides calculation as a number or text?

select cdctsos_date, count(*)
from covid_data_covid_tracking_states_original_source
where cdctsos_create_date > CURRENT_TIMESTAMP - interval '30 days'
group by cdctsos_date 
order by cdctsos_date asc

select * from covid_data_covid_tracking_us_original_source
select * from covid_data_covid_tracking_states_original_source
select * from test_table
select * from covid_data_state_abbreviation
select * from covid_data_state_governor_political_party
select * from covid_data_state_population
