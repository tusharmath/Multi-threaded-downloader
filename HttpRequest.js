"use strict";
var _ = require('lodash'),
    request = require('request'),
    DuplexStream = require('./DuplexStream');

module.exports = function (url, headers) {
    var defer = Promise.defer(),
        stream = new DuplexStream(),
        response,
        done = false,
        resolve = _.once(() => defer.resolve({read, response})),
        isComplete = () => stream.hasData() || done === false,
        read = function * () {
            while (isComplete()) {
                yield stream.read();
            }
        };
    request({url, headers})
        .on('response', (x) => {
            if (x.statusCode != 206) {
                throw Error(x.statusMessage);
            }
            response = x
        })
        .on('data', (buffer) => stream.write(buffer))
        .on('data', resolve)
        .on('complete', () => done = true);
    return defer.promise;
};