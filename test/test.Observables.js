/**
 * Created by tusharmathur on 7/29/15.
 */
"use strict";
var Observables = require('../src/lib/Observables');

describe("Observables", function () {
    it("HEAD request to jpg file", function * () {
        var response = yield Observables.requestHead('http://localhost:3000/files/pug.jpg');
        response.headers['content-length'].should.equal('317235');
    });

    it("HEAD request to 1024 bytes file", function * () {
        var response = yield Observables.requestHead('http://localhost:3000/range/1024.txt');
        response.headers['content-length'].should.equal('1024');

    });
});