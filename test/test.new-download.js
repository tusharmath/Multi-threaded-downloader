"use strict";

var downloader = require('../').download,
    chai = require('chai'),
    crypto = require('crypto'),
    fs = require('fs'),
    md5HashBuilder = crypto.createHash('md5'),
    FILENAME = './out.jpg',
    mtd = downloader({
        path: FILENAME
    }),
    s = fs.ReadStream(FILENAME),
    uri = 'http://i.ytimg.com/vi/pzPxhaYQQK8/hqdefault.jpg';
chai.should();
describe('RealDownload', function () {

    it("download pug picture", function (done) {
        this.timeout(5000);
        mtd.start(uri, function () {
            s.on('data', function (d) {
                md5HashBuilder.update(d);
            });
            s.on('end', function () {
                var md5Digest = md5HashBuilder.digest('hex');
                md5Digest.toLowerCase().should.equal('ef278f46709ebb6f6d84cefc57c0caef');
                done();
            });
        });
    });
});

