"use strict";
var _ = require('lodash'),
    request = require('request'),
    utils = require('./Utility'),
    rx = require('rx'),
    co = require('co');

var requestBody = function (url, headers) {
    return rx.Observable.create(function (observer) {
        request({url, headers})
            .on('data', x => observer.onNext(x))
            .on('complete', x => observer.onCompleted(x))
            .on('error', x => observer.onError(x));
    });
};
var requestHead = utils.promisify(request.head);

module.exports = {
    requestBody,
    requestHead
};