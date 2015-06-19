/**
 * Created by tusharmathur on 5/15/15.
 */
var fs = require('fs');
var mockery = require('mockery');
var utils = require('../').utils;
var sinon = require('sinon');
var chai = require('chai');
var event = require('common-js-pub-sub');
var expect = chai.expect;

chai.should();

describe('Downloader', function () {
    var u, params, fsStub, ev;

    beforeEach(function () {
        params = {
            path: 'file.txt',
            fd: {},
            totalFileSize: 0,
            position: 120
        };
        ev = event();
        sinon.stub(ev, 'subscribe');
        sinon.stub(ev, 'publish');
        sinon.stub(fs, 'open');
        sinon.stub(fs, 'write');
        u = utils(params, ev);

    });
    afterEach(function () {
        fs.open.restore();
        fs.write.restore();
        ev.subscribe.restore();
        ev.publish.restore();
    });

    describe("stripFirstParamAsError()", function () {
        it("strips first param", function () {
            var temp = sinon.spy();
            u.stripFirstParamAsError(temp)(100, 200);
            temp.calledWith(200).should.be.ok;
        });

        it("throws if type is error", function () {
            var temp = sinon.spy();
            expect(function () {
                u.stripFirstParamAsError(temp)(Error(100), 200);
            }).to.throw('100');
        });
    });

    it("setFileDescriptorOnParams()", function () {
        u.setFileDescriptorOnParams(100);
        params.fd.should.equal(100);
    });

    it("createFileDescriptor()", function () {
        u.createFileDescriptor(1, 2, 3);
        fs.open.calledWith('file.txt', 'w+', u.FILE_OPEN).should.be.ok;
        fs.open.getCall(0).args.length.should.equal(3);

    });

    it("setFileDescriptorOnParams()", function () {
        u.setFileDescriptorOnParams(1000);
        params.fd.should.equal(1000);
    });

    it("writeBufferAtPosition()", function () {
        var buffer = {length: 100};
        u.writeBufferAtPosition(buffer);
        fs.write.calledWith(params.fd, buffer, 0, 100, 120, u.DATA_SAVE).should.be.ok;
    });

    it("extractAndSetContentLengthOnParams()", function () {
        u.extractAndSetContentLengthOnParams({headers: {'content-length': 1000}});
        params.totalFileSize.should.equal(1000);
    });

    it("updateAndSetPositionOnParams()", function () {
        var buffer = {length: 1000};
        u.updateAndSetPositionOnParams(buffer);
        params.position.should.equal(1120);
    });
});