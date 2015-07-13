"use strict";
var _ = require('lodash'),
    request = require('request');

module.exports = function (url, headers) {
    var defer = Promise.defer();
    request({url, headers})
        .on('response', function (_response) {
            _response.pause();
            defer.resolve({
                read: function * () {
                    var chunk;
                    while (null !== (chunk = _response.read())) {
                        yield chunk;
                    }
                }
            });
        });

    return defer.promise;
};