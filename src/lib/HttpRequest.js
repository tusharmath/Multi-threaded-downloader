"use strict";
var _ = require('lodash'),
    request = require('request'),
    rx = require('rx'),
    co = require('co');
module.exports = function (url, headers) {
    return rx.Observable.create(function (observer) {
        request({url, headers})
            .on('data', x => observer.onNext(x))
            .on('complete', x => observer.onCompleted(x))
            .on('error', x => observer.onError(x));
    });
};