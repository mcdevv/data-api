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
