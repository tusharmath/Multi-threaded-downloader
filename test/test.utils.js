var chai = require('chai');
chai.use(require('chai-as-promised'));
var should = chai.should();
var expect = chai.expect;
var u = require('../lib/utils');
describe('utils', function () {
    function successful(a, b, c, d) {
        setTimeout(function () {
            d(null, a + b + c);
        })
    }

    function failed(a, b, c, d) {
        setTimeout(function () {
            d('sample-exception');
        })
    }

    describe('qromise()', function () {
        it('should return promises', function () {
            should.exist(u.qromise(successful)(100, 200, 300).then);
        });
        it('should resolve promises', function () {
            return u.qromise(successful)(100, 200, 300).should.eventually.equal(600)
        });
        it('should reject promises', function () {
            return u.qromise(failed)(100, 200, 300)
                .should.be.rejectedWith('sample-exception')
        });
    });
});