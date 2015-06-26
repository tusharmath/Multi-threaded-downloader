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

function download(options) {
    options = _.assign(options, defaultOptions);
    options.path += '.mtd';
    return {
        start: co.wrap(function * (url) {
            var headResponse = yield u.requestHead(url);
            var dataComplete = false,
                totalBytes = u.getTotalBytesFromResponse(headResponse),
                meta = u.createMetaData(totalBytes, url, options.path, THREAD_COUNT),
                fd = yield u.createFileDescriptor(options);
            var iterable = _.times(THREAD_COUNT, function (threadIndex) {
                var defer = Promise.defer(),
                    async = _.partial(u.async, defer.reject),
                    range = u.getThreadRange(THREAD_COUNT, threadIndex, totalBytes),
                    headers = {'range': `bytes=${range.start}-${range.end}`};
                meta.setRange(threadIndex, range);
                request({url, headers})
                    .on('data', async(function *(buffer) {

                        //Write Data
                        range.start += buffer.length;

                        //console.log(startPosition, headers, buffer.length);
                        yield u.fsWrite(fd, buffer, 0, buffer.length, range.start - buffer.length);

                        //Write Meta
                        var metaBuffer = meta.updatePosition(threadIndex, buffer.length).toBuffer();
                        yield u.writeMetaData(fd, metaBuffer, totalBytes + 1);

                        //Data Completed
                        if (dataComplete && range.start >= range.end) {
                            defer.resolve();
                        }
                    }))
                    .on('complete', async(function * () {
                        dataComplete = true;
                    }))
                    .on('error', defer.reject);

                return defer.promise;
            });
            return yield Promise.all(iterable).then(co.wrap(function * () {
                yield u.fsTruncate(fd, totalBytes);
                yield u.fsRename(options.path, options.path.replace('.mtd', ''));
            }));
        })
    }
}

exports.download = download;