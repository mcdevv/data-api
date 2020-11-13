/*
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
import supertest from 'supertest';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import app from '../src/app';

chai.use(sinonChai);
export const { expect } = chai;
export const server = supertest.agent(app);
export const BASE_URL = '/v1'; // ??? should be configurable"
