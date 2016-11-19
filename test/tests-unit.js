var expect = require('chai').expect;
var assert = require('chai').assert;

describe('Fortune cookie tests', () => {
    it('getFortune() should return a fortune', () => {
        assert(typeof 'This too shall pass' === 'string', 'fortune tale is a string');
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
