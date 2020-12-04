/*

??? mocha tries to run all files in this dir

having: 
yarn add --dev mocha chai nyc sinon-chai supertest coveralls

mocha
test runner

chai
used to make assertions

nyc
collect test coverage report

sinon-chai
extends chai’s assertions

supertest
used to make HTTP calls to our API endpoints

coveralls
for uploading test coverage to coveralls.io

test/setup.js
is a helper file that helps us 
organize all the imports we need in our test files

*/
import supertest from 'supertest'; // HTTP assertions made easy
import chai from 'chai'; // https://www.chaijs.com/api/bdd/ - expect() examples
import sinonChai from 'sinon-chai'; // All of your favorite Sinon.JS assertions made their way into Sinon–Chai
import app from '../src/app';

chai.use(sinonChai);
export const { expect } = chai;
export const server = supertest.agent(app);
// export const server = supertest(app); //  what is the difference?
// ??? neither hits the server running against build/ if it is running
//     necessary, or do we just trust babel? ... or, other ETE testing?
export const BASE_URL = '/v1'; // ??? should be configurable"

