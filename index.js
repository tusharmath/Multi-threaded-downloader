/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var _ = require('lodash'),
    request = require('request'),
    co = require('co'),
    MAX_BUFFER = 512,
    THREAD_COUNT = 1,
    u = require('./Utility');
var defaultOptions = {
    headers: {}
};
var createMetaData = function (totalBytes, url, path, count) {
    var threads = _.fill(_.times(count), {});
    var data = {totalBytes, url, path, threads};
    return {
        toBuffer: function () {
            var metaBuffer = new Buffer(MAX_BUFFER);
            _.fill(metaBuffer, null);
            metaBuffer.write(JSON.stringify(data));
            return metaBuffer;
        },
        updatePosition: function (index, distance) {
            data.threads[index].position += distance;
        },
        setRange: function (index, range) {
            var thread = data.threads[index];
            thread.start = range.start;
            thread.end = range.end;
            thread.position = range.start;
        }
    }
};
function download(options) {
    options = _.assign(options, defaultOptions);
    options.path += '.mtd';
    return {
        start: co.wrap(function * (url) {
            var dataComplete = false,
                totalBytes = parseInt((yield u.requestHead(url)).headers['content-length'], 10),
                meta = createMetaData(totalBytes, url, options.path, THREAD_COUNT),
                fd = yield u.fsOpen(options.path, 'w+');
            var iterable = _.times(THREAD_COUNT, function (threadIndex) {
                var defer = Promise.defer(),
                    async = _.partial(u.async, defer.reject),
                    bytesPerThread = Math.round(totalBytes / THREAD_COUNT),
                    position = Math.floor(bytesPerThread * threadIndex),
                    endPosition = THREAD_COUNT - threadIndex === 1 ? totalBytes : position + bytesPerThread - 1,
                    headers = {'range': `bytes=${position}-${endPosition}`};
                meta.setRange(threadIndex, position, endPosition);
                request({url, headers})
                    .on('data', async(function *(buffer) {

                        //Write Data
                        position += buffer.length;

                        //console.log(position, headers, buffer.length);
                        yield u.fsWrite(fd, buffer, 0, buffer.length, position - buffer.length);
                        meta.updatePosition(threadIndex, buffer.length);

                        //Write Meta
                        var metaBuffer = meta.toBuffer();
                        yield u.fsWrite(fd, metaBuffer, 0, metaBuffer.length, totalBytes);

                        //Data Completed
                        if (dataComplete && position >= endPosition) {
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