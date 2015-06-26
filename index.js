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

var connectionCompleted = function (connection, thread) {
    if (connection.complete && thread.hasCompleted()) {
        connection.resolve();
    }
};

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
                    position = range.start,
                    headers = {'range': `bytes=${range.start}-${range.end}`};
                connection.complete = false;
                meta.thread(threadIndex).setRange(range);

                request({url, headers})
                    .on('data', async(function *(buffer) {
                        var writePosition = position;
                        position+= buffer.length;
                        yield writeBufferAt(buffer, writePosition);
                        meta.thread(threadIndex).updatePosition(buffer.length);

                        yield writeBufferAt(meta.toBuffer(), totalBytes + 1);
                        connectionCompleted(connection, meta.thread(threadIndex));
                    }))
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