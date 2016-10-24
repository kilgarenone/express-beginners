// var fortune = require('../lib/fortunecookies.js');
var expect = require('chai').expect;
var assert = require('chai').assert;
// var Promise = require('bluebird');

describe('Fortune cookie tests', () => {
    it('getFortune() should return a fortune', () => {
        assert(typeof fortune.getFortune() === 'string', 'fortune tale is a string');
    });
});

describe('Test Async Code', () => {
    it('Expectations are executed in async callback', (done) => {
        new Promise((resolve, reject) => {
            resolve('hello');
        }).then((data) => {
            expect(data).to.equal('hello');
            done();
        }).catch(done);
    });
});
