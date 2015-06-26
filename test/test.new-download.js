"use strict";

var Download = require('../'),
    chai = require('chai'),
    crypto = require('crypto'),
    fs = require('fs'),
    md5HashBuilder = crypto.createHash('md5'),
    uri = 'http://localhost:3000/out.jpg',
    FILENAME = './out.jpg',
    mtd = new Download({
        path: FILENAME, url: uri
    }),
    fileStream = fs.ReadStream(FILENAME)
    ;
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
        }).should.eventually.equal('E20B6F984BE9AB2E07E7AC287B831C9303D21101'.toLowerCase());
    });
});

