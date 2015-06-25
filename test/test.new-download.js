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
    fileStream = fs.ReadStream(FILENAME),
    uri = 'http://i.ytimg.com/vi/pzPxhaYQQK8/hqdefault.jpg';
chai.should();
chai.use(require("chai-as-promised"));
describe('NewDownload', function () {

    it("download pug picture", function () {
        this.timeout(5000);
        return mtd.start(uri).then(function () {
            var defer = Promise.defer();
            var shasum = crypto.createHash('sha1');
            var s = fs.ReadStream(FILENAME);
            s.on('data', function (d) {
                shasum.update(d);
            });

            s.on('end', function () {
                defer.resolve(shasum.digest('hex'))
            });
            return defer.promise;
        }).should.eventually.equal('c4ad77ad6468c54b11bcbc52cb56cb938c6a2dee');
    });
});

