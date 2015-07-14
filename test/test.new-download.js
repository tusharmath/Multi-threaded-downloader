"use strict";

var Download = require('../'),
    chai = require('chai'),
    crypto = require('crypto'),
    fs = require('fs'),
    md5HashBuilder = crypto.createHash('md5'),
    uri = 'http://localhost:3000/in.txt',
    FILENAME = './.temp/out.txt',
    mtd = new Download({
        path: FILENAME, url: uri
    }),
    server = require('../test-server'),
    fileStream = fs.ReadStream(FILENAME)
    ;
chai.should();
describe('NewDownload', function () {
    before(function *() {
        yield server.start();
    });

    it("download pug picture", function * () {
        this.timeout(5000);
        yield mtd.start(uri);
        var defer = Promise.defer();
        var shasum = crypto.createHash('sha1');
        var s = fs.ReadStream(FILENAME);
        s.on('data', function (d) {
            shasum.update(d);
        });

        s.on('end', function () {
            defer.resolve(shasum.digest('hex'))
        });
        var digest = yield defer.promise;
        digest.should.equal('60E5CAAE3BABBEDC4CA95B9AA3ED7AC2A9B031C9'.toLowerCase());
    });
});

