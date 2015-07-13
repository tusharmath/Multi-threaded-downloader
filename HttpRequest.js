"use strict";
var _ = require('lodash'),
    request = require('request');

module.exports = function (url, headers) {
    var defer = Promise.defer(),
        response,
        data = [],
        done = false,
        resolve = _.once(function () {
            defer.resolve({read, response});
        }),
        read = function * () {
            while (done === false ||  data.length > 0) {
                yield data.shift();
            }
        };
    request({url, headers})
        .on('response', function (_response) {
            response = _response;
        })
        .on('data', function (buffer) {
            data.push(buffer);
            resolve();
        })
        .on('complete', function () {
            done = true;
        });

    return defer.promise;
};