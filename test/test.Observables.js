/**
 * Created by tusharmathur on 7/29/15.
 */
"use strict";
var Observables = require('../src/lib/Observables'),
    Rx = require('rx'),
    fs = require('fs'),
    removeFile = (x) => Rx.Observable.fromCallback(fs.unlink)(x).toPromise();

describe("Observables", function () {
    it("HEAD request to jpg file", function * () {
        var response = yield Observables.requestHead('http://localhost:3000/files/pug.jpg').toPromise();
        response.headers['content-length'].should.equal('317235');
    });

    it("HEAD request to 1024 bytes file", function * () {
        var response = yield Observables.requestHead('http://localhost:3000/range/1024.txt').toPromise();
        response.headers['content-length'].should.equal('1024');

    });
    describe("fsOpen()", function () {
        afterEach(function *() {
            return removeFile('./.temp/open.txt');
        });
        it("file open request", function * () {
            var response = yield Observables.fsOpen('./.temp/open.txt', 'w+').toPromise();
            response.should.be.a('number');
        });
    });

});