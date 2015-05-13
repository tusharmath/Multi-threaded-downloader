var Q = require('q');
var request = require('request');
var fs = require('fs');
var u = {};
u.qromise = function (func) {
    return function (...args) {
        var defer = Q.defer();
        args[func.length - 1] = function (err, res) {
            if (err) {
                return defer.reject(err);
            }
            defer.resolve(res);
        };
        func.apply(null, args);
        return defer.promise;
    };
};

u.triggerEvent = function (eventHandler, event, data) {
    var cb;
    if (cb = eventHandler[event]) {
        cb(data);
    }
};

u.stripError = function (onError, func) {
    return function (err, response) {
        if (err) {
            onError(err);
        } else {
            func(response);
        }
    };
};

u.makeRequest = function (url, headers, onStart, onEnd, onError, onData) {
    request(url, headers)
        .on('end', onEnd)
        .on('data', onData)
        .on('error', onError)
        .on('response', onStart)
};
u.writeToFile = function (fd, data, position, onDataWritten) {
    fs.write(fd, data, 0, data.length, position, onDataWritten);
    return position + data.length;
};

u.openFile = function (path, mode, callback) {
    fs.open(path, mode, callback);
};

u.emptyCb = function (){};
module.exports = u;