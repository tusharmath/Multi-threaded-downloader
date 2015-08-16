'use strict';
var request = require('request'),
    Rx = require('Rx'),
    _ = require('lodash'),
    fs = require('fs');

var requestBody = function (url, headers) {
        return Rx.Observable.create(function (observer) {
            request({url, headers})
                .on('data', x => observer.onNext(x))
                .on('complete', x => observer.onCompleted(x))
                .on('error', x => observer.onError(x));
        });
    },
    requestHead = Rx.Observable.fromNodeCallback(request.head, null, _.identity),
    fsOpen = Rx.Observable.fromNodeCallback(fs.open),
    fsWrite = Rx.Observable.fromNodeCallback(fs.write),
    fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate),
    fsRename = Rx.Observable.fromNodeCallback(fs.rename);

module.exports = {
    requestBody,
    requestHead,
    fsOpen,
    fsWrite,
    fsTruncate,
    fsRename
};