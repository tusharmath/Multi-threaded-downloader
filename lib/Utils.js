var Q = require('q');
var fs = require('fs');
var _ = require('lodash');
var EventHandler = require('./EventHandler');
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

u.writeToFile = function (fd, data, position, onDataWritten) {
    fs.write(fd, data, 0, data.length, position, onDataWritten);
    return position + data.length;
};

u.openFile = function (path, mode, callback) {
    fs.open(path, mode, callback);
};

u.getResponseSize = function (res) {
    return parseInt(res.headers['content-length'], 10);
};

u.flux = function () {
    return new EventHandler();
};

u.emptyCb = function () {
};
module.exports = u;