import { Model, sql } from '../../src/models/model';
// this is never run on Github Actions, locally only
(async () => {
  try {
    const model = new Model();
    const queries = [

// drop views in the proper order; some views depend on other views
sql`DROP MATERIALIZED VIEW IF EXISTS covid_data_covid_tracking`,
sql`DROP MATERIALIZED VIEW IF EXISTS covid_data_state_metadata`,
// create state metadata view

// note: using wrong prefix. also, the index name is stale


sql`
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
          CAST (alias.population AS NUMERIC) AS cdmd_population,
          CAST (alias.population AS NUMERIC) / 1000000 AS cdmd_population_millions
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
    ORDER BY 2
  WITH NO DATA
`, // WITH NO DATA - can't query view until the initial data load is complete via the first REFRESH
// at least one index is required in order to refresh CONCURRENTLY (after daily data load)
sql`
  CREATE UNIQUE INDEX cdsm_state_abbreviation_idx_unique 
  ON covid_data_state_metadata (cdmd_state)
`,
sql`REFRESH MATERIALIZED VIEW covid_data_state_metadata`,

// build the covid data view
sql`
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
    SELECT alias.date AS cdct_date
          ,alias.state AS cdct_state
          ,alias.positive AS cdct_positive
          ,alias.positive / cdmd_population_millions AS cdct_positive_per_million
          ,alias.positive_Increase AS cdct_positive_increase
          ,alias.positive_Increase / cdmd_population_millions AS cdct_positive_increase_per_million
          ,alias.hospitalized_Currently AS cdct_hospitalized_currently
          ,alias.hospitalized_Currently / cdmd_population_millions AS cdct_hospitalized_currently_per_million
          ,alias.hospitalized_Cumulative AS cdct_hospitalized_cumulative
          ,alias.hospitalized_Cumulative / cdmd_population_millions AS cdct_hospitalized_cumulative_per_million
          ,alias.hospitalized_Increase AS cdct_hospitalized_increase
          ,alias.hospitalized_Increase / cdmd_population_millions AS cdct_hospitalized_increase_per_million
          ,alias.death AS cdct_death
          ,alias.death / cdmd_population_millions AS cdct_death_per_million
          ,alias.death_Increase AS cdct_death_increase
          ,alias.death_Increase / cdmd_population_millions AS cdct_death_increase_per_million
          ,alias.total_Test_Results AS cdct_total_test_results
          ,alias.total_Test_Results / cdmd_population_millions AS cdct_total_test_results_per_million
          ,alias.total_Test_Results_Increase AS cdct_total_test_results_increase
          ,alias.total_Test_Results_Increase / cdmd_population_millions AS cdct_total_test_results_increase_per_million
          ,NULL AS cdct_data_quality_grade
          ,NULL AS cdct_last_update_et -- API says deprecated, but looks like boilerplate from the state API docs
    FROM (
      SELECT cdctsos_date AS date
            ,cdmd_governor_party as governor_party
            ,CASE
              WHEN cdmd_governor_party = 'Democratic' THEN 'D1'
              WHEN cdmd_governor_party = 'Republican' THEN 'R1'
            END AS state
            ,sum(cdctsos_positive) AS positive
            ,sum(cdctsos_positiveIncrease) AS positive_increase
            ,sum(cdctsos_hospitalizedCurrently) AS hospitalized_currently
            ,sum(cdctsos_hospitalizedCumulative) AS hospitalized_cumulative
            ,sum(cdctsos_hospitalizedIncrease) AS hospitalized_increase
            ,sum(cdctsos_death) AS death
            ,sum(cdctsos_deathIncrease) AS death_increase
            ,sum(cdctsos_totalTestResults) AS total_test_results
            ,sum(cdctsos_totalTestResultsIncrease) AS total_test_results_increase
      FROM covid_data_covid_tracking_states_original_source
        INNER JOIN covid_data_state_metadata ON cdctsos_state = cdmd_abbreviation
      WHERE cdmd_governor_party not in ('New Progressive')
      GROUP BY cdctsos_date, cdmd_governor_party
    ) AS alias
    INNER JOIN covid_data_state_metadata ON alias.state = cdmd_abbreviation
    ORDER BY 1 desc, 2 asc
  WITH NO DATA
`,
sql`
CREATE UNIQUE INDEX cdct_date_state_idx_unique
ON covid_data_covid_tracking (cdct_date, cdct_state)
`,
sql`REFRESH MATERIALIZED VIEW covid_data_covid_tracking`,

    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const query of queries.slice(0, Infinity)) {
      const res = await model.runQueryWithReturn(query);
      console.log('query:', query);
    }
  } catch (err) {
    console.error('error:', err.message);
    process.exit(1); // ??? see ttd links in readme to improve the approach
  }
})();
/*
next:
* check state-date, then check all cols,
  if different, update, not insert
  thus can track when data is modified ...
  very intensive though, but who cares ...
    could build a table, then query to compare
* later: how to 'move' new view to production ...
* testing view before REFRESH ...
  create an identical test view with a fixed set of data
  test it locally with queries
* US population ex territories is an issue RE comparison to covid-tracking charts?
  US population is based on US data which is based on total US
  ttd: yes, add territories into US pop total
       total does not depend on which states used in same chart ...
* run a bunch of queries against the view ... got what I need?
* turn off red for empty space at end of line, ffs
  want it to clean, but don't want it to pester me
* get those to setup urls, so I have something to check for documenting
  reasoning of choices
* more intermediate views for testing? instead of subqueries to main view?
  but more steps for build views and dagster
  take advice ...
  intermediate views may be needed later (in prod)
  intermediate views are complicated
  intermediate views naming convention
  non-prod views??? someone will .prod. them
  maybe have subqueries views separately and testable as simple queries in
    the code
  intermediate views are complicated and should be tested
  less complicated to test
  !!!build a view, test, then rename ...
     but, if the source data is tested, and the view is tested ...
* twitter post: cognitive load - reduce it for your future self
                and for other DEVs
* map the expected queries to API endpoint
  ... you just get more than you need or ...
* should I trim the long decimal places ... to save space?
  try query from a test script and see how it looks
* 

 */









