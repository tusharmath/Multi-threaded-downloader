/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var _ = require('lodash'),
    request = require('request'),
    co = require('co'),
    MAX_BUFFER = 512,
    u = require('./Utility');
var defaultOptions = {
    headers: {}
};

function download(options) {
    options = _.assign(options, defaultOptions);
    options.path += '.mtd';
    return {
        start: co.wrap(function * (uri) {
            var position = 0, totalBytes, fd, defer, dataComplete = false, async;

            fd = yield u.fsOpen(options.path, 'w+');
            defer = Promise.defer();
            async = _.partial(u.async, defer.reject);
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
                .on('data', async(onData))
                .on('response', async(onResponse))
                .on('complete', async(onComplete));

            return yield defer.promise;
        })
    }
}

exports.download = download;