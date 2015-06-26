/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var _ = require('lodash'),
    request = require('request'),
    co = require('co'),
    THREAD_COUNT = 2,
    u = require('./Utility');
var defaultOptions = {
    headers: {}
}, writeBufferAt;

var onDataAsync = _.curry(function *(meta, fd, totalBytes, threadIndex, connection, range, buffer) {
    var writePosition = range.start;
    range.start += buffer.length;
    yield writeBufferAt(buffer, writePosition);
    meta.thread(threadIndex).updatePosition(buffer.length);

    yield writeBufferAt(meta.toBuffer(), totalBytes + 1);
    if (connection.complete && range.start >= range.end) {
        connection.resolve();
    }
});

function download(options) {
    options = _.assign(options, defaultOptions);
    options.path += '.mtd';
    return {
        start: co.wrap(function * (url) {
            var totalBytes = u.getTotalBytesFromResponse(yield u.requestHead(url)),
                meta = u.createMetaData(totalBytes, url, options.path, THREAD_COUNT),
                fd = yield u.createFileDescriptor(options);
            writeBufferAt = _.partial(u.writeData, fd);
            var iterable = _.times(THREAD_COUNT, function (threadIndex) {
                var connection = Promise.defer(),

                    async = _.partial(u.async, connection.reject),
                    range = u.getThreadRange(THREAD_COUNT, threadIndex, totalBytes),
                    headers = {'range': `bytes=${range.start}-${range.end}`};
                connection.complete = false;
                meta.thread(threadIndex).setRange(range);

                request({url, headers})
                    .on('data', async(onDataAsync(meta, fd, totalBytes, threadIndex, connection, range)))
                    .on('complete', async(function * () {
                        connection.complete = true;
                    }))
                    .on('error', connection.reject);

                return connection.promise;
            });
            return yield Promise.all(iterable).then(co.wrap(function * () {
                yield u.fsTruncate(fd, totalBytes);
                yield u.fsRename(options.path, options.path.replace('.mtd', ''));
            }));
        })
    }
}

exports.download = download;