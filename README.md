


* app directory structure by express-generator
* http://localhost:3000/v1
* 
* issues: 
  * .coveralls.yml repo_token is private, add file to .gitignore??? is it only needed by the coverage script?
  * 

[![Build Status](https://travis-ci.com/mcdevv/data-api.svg?token=7fpWGwwX91xyrjXdL85A&branch=main)](https://travis-ci.com/mcdevv/data-api)

[![Coverage Status](https://coveralls.io/repos/github/mcdevv/data-api/badge.svg?branch=main)](https://coveralls.io/github/mcdevv/data-api?branch=main)

[![Maintainability](https://api.codeclimate.com/v1/badges/67afbeb4bbb35f2090d1/maintainability)](https://codeclimate.com/github/mcdevv/data-api/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/67afbeb4bbb35f2090d1/test_coverage)](https://codeclimate.com/github/mcdevv/data-api/test_coverage)



# Express API template

[![Build Status](https://travis-ci.com/chidimo/Express-API-Template.svg?token=vRPqNDsj84fjiYCWzphq&branch=master)](https://travis-ci.com/chidimo/Express-API-Template)
[![Coverage Status](https://coveralls.io/repos/github/chidimo/Express-API-Template/badge.svg?branch=master)](https://coveralls.io/github/chidimo/Express-API-Template?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/b6cf857f9c2ff789743e/maintainability)](https://codeclimate.com/github/chidimo/Express-API-Template/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b6cf857f9c2ff789743e/test_coverage)](https://codeclimate.com/github/chidimo/Express-API-Template/test_coverage)
[![Build status](https://ci.appveyor.com/api/projects/status/h2uvmx9yft68k6b2?svg=true)](https://ci.appveyor.com/project/chidimo/express-api-template)

Live API endpoint: <https://express-api-template.herokuapp.com/v1>

Read the article here <https://www.smashingmagazine.com/2020/04/express-api-backend-project-postgresql/>

## How to run the app

1. Clone the repo
1. Create a `.env` file at the project root and provide the following environment variables

    TEST_ENV_VARIABLE="some arbitrary string"
    CONNECTION_STRING="a url pointing to a PostgreSQL database"
    PORT="port number to serve the files. defaults to 3000"

1. Open a terminal in the project root and run `yarn install` to install the project dependencies.
1. Run `yarn test` to make sure everything is working correctly.
1. Run `yarn startdev` to start the development server
1. Open `http://localhost:3000` or use whatever port you supplied in your environment variable.
1. Remember to replace the badges with your custom badges

## How to test

1. Run `yarn install` to install project dependencies
1. Run `yarn test`
