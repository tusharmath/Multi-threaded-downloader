"use strict";

var Download = require('../src/app'),
    Rx = require('Rx'),
    chai = require('chai'),
    crypto = require('crypto'),
    fs = require('fs');
require('../src/perf/TestServer');
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

var removeFile = (x) => Rx.Observable.fromCallback(fs.unlink)(x).toPromise();

describe('NewDownload', function () {
    describe("range-file", function () {
        afterEach(function *() {
            return yield removeFile('./.temp/1024.txt');
        });

        it("download dynamically created 1024 bytes file", function * () {
            var digest = yield createDownload('http://localhost:3000/range/1024.txt', './.temp/1024.txt');
            digest.should.equal('41BE89713FA15BC83D093DD67E558BADA8546388'.toLowerCase());
        });
    });
    describe("static-file", function () {
        afterEach(function *() {
            return yield removeFile('./.temp/pug.jpg');
        });

        it("download static pug image", function * () {
            var digest = yield createDownload('http://localhost:3000/files/pug.jpg', './.temp/pug.jpg');
            digest.should.equal('25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1'.toLowerCase());
        });
    });
});

