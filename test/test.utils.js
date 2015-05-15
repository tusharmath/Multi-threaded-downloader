var chai = require('chai');
chai.use(require('chai-as-promised'));
var should = chai.should();
var expect = chai.expect;
var U = require('../lib/utils');
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
    var u;
    beforeEach(function (){
        u = U();
    });

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

    describe("cache()", function () {
        var cache;
        beforeEach(function (){
            cache = u.cache();
        });
        it("creates a getter and setter", function () {
            cache.set('hello', 100);
            cache.get('hello').should.equal(100);
        });

        it("throws", function () {
            expect(function(){
                cache.get('hello');
            }).to.throw('no cache value set for: hello')
        });
    });
});