/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var _ = require('lodash');
var request = require('request');
var co = require('co');
var fs = require('fs');
var MAX_BUFFER = 512;

var defaultOptions = {
    headers: {}
};
function download(options) {
    options = _.assign(options, defaultOptions);
    options.path += '.mtd';
    return {
        start: co.wrap(function * (uri) {
            var position = 0, totalBytes, fd, defer, dataComplete = false;

            var u = {
                async: function (func) {
                    var coFunc = co.wrap(func);
                    return function () {
                        try {
                            coFunc.apply(null, arguments).catch(u.onError);
                        } catch (e) {
                            u.onError(e);
                        }
                    };
                },
                onError: function (err) {
                    defer.reject(err);
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
            fd = yield u.fsOpen(options.path, 'w+');
            defer = Promise.defer();
            var onData = function *(buffer) {
                var writeAt = position;
                position += buffer.length;
                var written = yield u.fsWrite(fd, buffer, 0, buffer.length, writeAt);
                var meta = new Buffer(MAX_BUFFER);
                _.fill(meta, null);
                meta.write(JSON.stringify({position, totalBytes, uri}));
                yield u.fsWrite(fd, meta, 0, meta.length, totalBytes);

                if (dataComplete) {
                    yield u.fsTruncate(fd, totalBytes);
                    yield u.fsRename(options.path, options.path.replace('.mtd', ''));
                    defer.resolve();
                }
            };
            var onResponse = function * (res) {
                return totalBytes = parseInt(res.headers['content-length'], 10);
            };
            var onComplete = function * () {
                dataComplete = true;
            };

            request(uri)
                .on('data', u.async(onData))
                .on('response', u.async(onResponse))
                .on('complete', u.async(onComplete));

            return yield defer.promise;
        })
    }
}

exports.download = download;