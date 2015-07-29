"use strict";

var Download = require('../src/app'),
    chai = require('chai'),
    crypto = require('crypto'),
    fs = require('fs'),
    md5HashBuilder = crypto.createHash('md5'),
    server = require('../src/perf/TestServer')
    ;
chai.should();

function * createDownload(url, path) {
    var mtd = new Download({path, url});
    yield mtd.start();
    var defer = Promise.defer();
    var hash = crypto.createHash('sha1');
    fs.createReadStream(path)
        .on('data', x => hash.update(x))
        .on('end', () => defer.resolve(hash.digest('hex')));
    return yield defer.promise;
}

describe('NewDownload', function () {
    it("download dynamically created 1024 bytes file", function * () {
        var digest = yield createDownload('http://localhost:3000/range/1024.txt', './.temp/1024.txt');
        digest.should.equal('41BE89713FA15BC83D093DD67E558BADA8546388'.toLowerCase());
    });

    it("download static pug image", function * () {
        var digest = yield createDownload('http://localhost:3000/files/pug.jpg', './.temp/pug.jpg');
        digest.should.equal('25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1'.toLowerCase());
    });
});

