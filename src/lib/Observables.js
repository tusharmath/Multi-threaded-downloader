'use strict';
var request = require('request'),
    utils = require('./Utility'),
    Rx = require('Rx'),
    fs = require('fs');

var requestBody = function (url, headers) {
        return Rx.Observable.create(function (observer) {
            request({url, headers})
                .on('data', x => observer.onNext(x))
                .on('complete', x => observer.onCompleted(x))
                .on('error', x => observer.onError(x));
        });
    },
    requestHeadAsync = utils.promisify(request.head),
    fsOpenAsync = utils.promisify(fs.open),
    fsWrite = Rx.Observable.fromCallback(fs.write),
    fsTruncate = Rx.Observable.fromCallback(fs.truncate),
    fsRename = Rx.Observable.fromCallback(fs.rename);

module.exports = {
    requestBody,
    requestHeadAsync,
    fsOpenAsync,
    fsWrite,
    fsTruncate,
    fsRename
};