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
};

var onDataAsync = _.curry(function *(meta, fd, totalBytes, threadIndex, connection, range, buffer) {

    //Write Data
    range.start += buffer.length;

    //console.log(startPosition, headers, buffer.length);
    yield u.fsWrite(fd, buffer, 0, buffer.length, range.start - buffer.length);

    //Write Meta
    var metaBuffer = meta.updatePosition(threadIndex, buffer.length).toBuffer();
    yield u.writeMetaData(fd, metaBuffer, totalBytes + 1);

    //Data Completed
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

            var iterable = _.times(THREAD_COUNT, function (threadIndex) {
                var connection = Promise.defer(),

                    async = _.partial(u.async, connection.reject),
                    range = u.getThreadRange(THREAD_COUNT, threadIndex, totalBytes),
                    headers = {'range': `bytes=${range.start}-${range.end}`};
                connection.complete = false;
                meta.setRange(threadIndex, range);

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