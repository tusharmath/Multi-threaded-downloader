"use strict";
var _ = require('lodash'),
    request = require('request');

module.exports = function (url, headers) {
    var defer = Promise.defer(),
        response,
        data = [],
        done = false,
        resolve = _.once(() => defer.resolve({read, response})),
        read = function * () {
            while (data.length > 0) {
                yield data.shift();
            }
        };
    request({url, headers})
        .on('response', (x) => {
            if(x.statusCode > 299){
                throw Error(x.statusMessage);
            }
            response = x
        })
        .on('data', (buffer) => data.push(buffer))
        .on('data', resolve)
        .on('complete', () => done = true);
    return defer.promise;
};