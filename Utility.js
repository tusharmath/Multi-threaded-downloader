/**
 * Created by tusharmathur on 6/25/15.
 */
var fs = require('fs'),
    _ = require('lodash'),
    request = require('request'),
    co = require('co');

var u = {
    async: function (onError, func) {
        var coFunc = co.wrap(func);
        return function () {
            try {
                coFunc.apply(null, arguments).catch(onError);
            } catch (e) {
                onError(e);
            }
        };
    },
    promisify: function (func) {
        var defer = Promise.defer(),
            handle = function (err, data) {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(data);
                }
            };
        return _.restParam(function (args) {
            args.push(handle);
            func.apply(null, args);
            return defer.promise;
        })
    }
};

u.fsWrite = u.promisify(fs.write);
u.fsOpen = u.promisify(fs.open);
u.fsTruncate = u.promisify(fs.truncate);
u.fsRename = u.promisify(fs.rename);
u.requestHead = u.promisify(request.head);

module.exports = u;