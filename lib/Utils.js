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

u.cache = function () {
    var cache = {};
    return {
        set: function (key, val) {
            cache[key] = val;
        },
        get: function (key) {
            var val = cache[key];
            if (val) {
                return val;
            }
            throw Error('no cache value set for: ' + key);
        }
    }
};

u.flux = flux();

u.stripException = _.partial(u.stripError, u.onError);

//EVENT TRIGGERS
u.TRIGGER_FILE_OPEN = u.stripException(_.partial(u.flux.publish, 'file.open'));
u.TRIGGER_DATA_SAVE = u.stripException(_.partial(u.flux.publish, 'data.save'));
u.TRIGGER_DATA_RECEIVE = _.partial(u.flux.publish, 'data.receive');
u.TRIGGER_DATA_START = _.partial(u.flux.publish, 'data.start');

u.emptyCb = function () {
};
module.exports = function () {
    return u
};