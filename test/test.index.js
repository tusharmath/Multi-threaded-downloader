/**
 * Created by tusharmathur on 5/15/15.
 */
var u = require('../').utils;
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('Downloader', function () {
    describe("stripFirstParam()", function () {
        it("strips first param", function () {
            var temp = sinon.spy();
            u.stripFirstParam(temp)(100, 200);
            temp.calledWith(200).should.be.ok;
        });

        it("throws if type is error", function () {
            var temp = sinon.spy();
            expect(() => u.stripFirstParam(temp)(Error(100), 200))
            .to.throw('100');
        });

    });
});