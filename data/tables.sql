

-- tables


DROP TABLE IF EXISTS covid_data_state_abbreviation;
CREATE TABLE IF NOT EXISTS covid_data_state_abbreviation
(cdsa_id SERIAL PRIMARY KEY
,cdsa_state VARCHAR NOT NULL
,cdsa_abbreviation CHAR(2) NOT NULL
,UNIQUE (cdsa_state, cdsa_abbreviation)
);

DROP TABLE IF EXISTS covid_data_state_governor_political_party;
CREATE TABLE IF NOT EXISTS covid_data_state_governor_political_party
(cdsgpp_id SERIAL PRIMARY KEY
,cdsgpp_state VARCHAR NOT NULL
,cdsgpp_party VARCHAR NOT NULL
,UNIQUE (cdsgpp_state, cdsgpp_party)
);


DROP TABLE IF EXISTS covid_data_state_population;
CREATE TABLE IF NOT EXISTS covid_data_state_population
(cdsp_id SERIAL PRIMARY KEY
,cdsp_state VARCHAR NOT NULL
,cdsp_population INTEGER NOT NULL CHECK(cdsp_population > 500000)
,UNIQUE (cdsp_state, cdsp_population)
);





-- tables to hold data exactly as is in the original source files

-- why original source tables containing exact what the API provides?
--   API fields are deprecated, etc. so only need to change the load
--   script and the transform, ideally not changing covid_data_covid_tracking
--   also, allows exploring the data via sql queries
DROP TABLE IF EXISTS covid_data_covid_tracking_us_original_source;
CREATE TABLE IF NOT EXISTS covid_data_covid_tracking_us_original_source
(cdctuos_id SERIAL PRIMARY KEY
,UNIQUE (cdctuos_date) -- comes with an automatic unique index
,cdctuos_date INTEGER NOT NULL -- use as a number until such time as date functions needed ... timezone is cited as ET, and time of day irrelevant
,cdctuos_states INTEGER NOT NULL
,cdctuos_positive INTEGER
,cdctuos_negative INTEGER
,cdctuos_pending INTEGER
,cdctuos_hospitalizedCurrently INTEGER
,cdctuos_hospitalizedCumulative INTEGER
,cdctuos_inIcuCurrently INTEGER
,cdctuos_inIcuCumulative INTEGER
,cdctuos_onVentilatorCurrently INTEGER
,cdctuos_onVentilatorCumulative INTEGER
,cdctuos_recovered INTEGER
,cdctuos_dateChecked VARCHAR
,cdctuos_death INTEGER
,cdctuos_hospitalized INTEGER
,cdctuos_totalTestResults INTEGER
,cdctuos_lastModified VARCHAR
,cdctuos_total INTEGER
,cdctuos_posNeg INTEGER
,cdctuos_deathIncrease INTEGER
,cdctuos_hospitalizedIncrease INTEGER
,cdctuos_negativeIncrease INTEGER
,cdctuos_positiveIncrease INTEGER
,cdctuos_totalTestResultsIncrease INTEGER
,cdctuos_hash VARCHAR
,cdctuos_create_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
,cdctuos_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS covid_data_covid_tracking_states_original_source;
CREATE TABLE IF NOT EXISTS covid_data_covid_tracking_states_original_source
(cdctsos_id SERIAL PRIMARY KEY
,UNIQUE (cdctsos_date, cdctsos_state) -- comes with an automatic unique index
,cdctsos_date INTEGER
,cdctsos_state VARCHAR
,cdctsos_positive INTEGER
,cdctsos_probableCases INTEGER
,cdctsos_negative INTEGER
,cdctsos_pending INTEGER
,cdctsos_totalTestResultsSource VARCHAR
,cdctsos_totalTestResults INTEGER
,cdctsos_hospitalizedCurrently INTEGER
,cdctsos_hospitalizedCumulative INTEGER
,cdctsos_inIcuCurrently INTEGER
,cdctsos_inIcuCumulative INTEGER
,cdctsos_onVentilatorCurrently INTEGER
,cdctsos_onVentilatorCumulative INTEGER
,cdctsos_recovered INTEGER
,cdctsos_dataQualityGrade VARCHAR
,cdctsos_lastUpdateEt VARCHAR
,cdctsos_last_update_et_timestamp TIMESTAMP WITHOUT TIME ZONE -- unused, using the date as text for now
,cdctsos_dateModified VARCHAR
,cdctsos_checkTimeEt VARCHAR
,cdctsos_death INTEGER
,cdctsos_hospitalized INTEGER
,cdctsos_dateChecked VARCHAR
,cdctsos_totalTestsViral INTEGER
,cdctsos_positiveTestsViral INTEGER
,cdctsos_negativeTestsViral INTEGER
,cdctsos_positiveCasesViral INTEGER
,cdctsos_deathConfirmed INTEGER
,cdctsos_deathProbable INTEGER
,cdctsos_totalTestEncountersViral INTEGER
,cdctsos_totalTestsPeopleViral INTEGER
,cdctsos_totalTestsAntibody INTEGER
,cdctsos_positiveTestsAntibody INTEGER
,cdctsos_negativeTestsAntibody INTEGER
,cdctsos_totalTestsPeopleAntibody INTEGER
,cdctsos_positiveTestsPeopleAntibody INTEGER
,cdctsos_negativeTestsPeopleAntibody INTEGER
,cdctsos_totalTestsPeopleAntigen INTEGER
,cdctsos_positiveTestsPeopleAntigen INTEGER
,cdctsos_totalTestsAntigen INTEGER
,cdctsos_positiveTestsAntigen INTEGER
,cdctsos_fips VARCHAR
,cdctsos_positiveIncrease INTEGER
,cdctsos_negativeIncrease INTEGER
,cdctsos_total INTEGER
,cdctsos_totalTestResultsIncrease INTEGER
,cdctsos_posNeg INTEGER
,cdctsos_deathIncrease INTEGER
,cdctsos_hospitalizedIncrease INTEGER
,cdctsos_hash VARCHAR
,cdctsos_commercialScore INTEGER
,cdctsos_negativeRegularScore INTEGER
,cdctsos_negativeScore INTEGER
,cdctsos_positiveScore INTEGER
,cdctsos_score INTEGER
,cdctsos_grade VARCHAR
,cdctsos_create_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
,cdctsos_modified_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS covid_data_state_abbreviation_original_source;
CREATE TABLE IF NOT EXISTS covid_data_state_abbreviation_original_source
(cdsaos_id SERIAL PRIMARY KEY
,cdsaos_state VARCHAR NOT NULL
,cdsaos_abbreviation CHAR(2) NOT NULL
,UNIQUE (cdsaos_state, cdsaos_abbreviation) -- comes with an automatic unique index
);

DROP TABLE IF EXISTS covid_data_state_governor_political_party_original_source;
CREATE TABLE IF NOT EXISTS covid_data_state_governor_political_party_original_source
(cdsgppos_id SERIAL PRIMARY KEY
,cdsgppos_state VARCHAR NOT NULL
,cdsgppos_party VARCHAR NOT NULL
,UNIQUE (cdsgppos_state, cdsgppos_party)
);

DROP TABLE IF EXISTS covid_data_state_population_original_source;
CREATE TABLE IF NOT EXISTS covid_data_state_population_original_source
(cdspos_id SERIAL PRIMARY KEY
,cdspos_state VARCHAR NOT NULL
,cdspos_population VARCHAR NOT NULL
,cdspos_abbreviation VARCHAR
,cdspos_geo_id VARCHAR
,cdspos_pop_density VARCHAR
,UNIQUE (cdspos_state)
);