"use strict";

var Download = require('../'),
    chai = require('chai'),
    crypto = require('crypto'),
    fs = require('fs'),
    md5HashBuilder = crypto.createHash('md5'),
    uri = 'http://localhost:3000/out.txt',
    FILENAME = './out.txt',
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
            //    http://onlinemd5.com/
        }).should.eventually.equal('033C56D114C922E1C60C8404697C1FDC30DE5559'.toLowerCase());
    });
});

