"use strict";
var _ = require('lodash'),
    request = require('request'),
    Observer = require('./ObservableStream');

module.exports = function (url, headers) {
    var defer = Promise.defer(),
        observer = new Observer(),
        response,
        resolve = _.once(()=> defer.resolve(observer));
    request({url, headers})
        .on('response', (x) => {
            if (x.statusCode != 206) {
                throw Error(x.statusMessage);
            }
            response = x
        })
        .on('data', (buffer) => observer.write(buffer))
        .on('data', resolve)
        .on('complete', () => observer.end());
    return defer.promise;
};