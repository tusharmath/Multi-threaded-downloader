/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    request = require('request'),
    co = require('co');

var defaultOptions = {
    headers: {},
    threadCount: 3
};
var fsWrite = promisify(fs.write),
    fsOpen = promisify(fs.open),
    fsTruncate = promisify(fs.truncate),
    fsRename = promisify(fs.rename),
    requestHead = promisify(request.head);

function asyncFunc(onError, func) {
    var coFunc = co.wrap(func);
    return () => {
        try {
            coFunc.apply(null, arguments).catch(onError);
        } catch (e) {
            onError(e);
        }
    };
}
function promisify(func) {
    var defer = Promise.defer(),
        handle = (err, data) => err ? defer.reject(err) : defer.resolve(data);
    return _.restParam(function (args) {
        args.push(handle);
        func.apply(null, args);
        return defer.promise;
    })
}

var writeData = (fd, buffer, position) => fsWrite(fd, buffer, 0, buffer.length, position);
var getLength = (res) => parseInt(res.headers['content-length'], 10);
var createFileDescriptor = (path) => fsOpen(path, 'w+');
var createRangeHeader = function (count, totalBytes, i) {
    var range = getThreadRange(count, totalBytes, i);
    return {'range': `bytes=${range.start}-${range.end}`};
};
var createThread = function (range) {
    return {
        defer: Promise.defer(),
        start: range.start,
        end: range.end,
        position: range.start,
        updatePosition: function (distance) {
            this.position += distance;
            if (this.position >= this.end) {
                this.defer.resolve(this);
            }
        }
    };
};
function toBuffer(data, MAX_BUFFER) {
    MAX_BUFFER = MAX_BUFFER || 512;
    var metaBuffer = new Buffer(MAX_BUFFER);
    _.fill(metaBuffer, null);
    metaBuffer.write(JSON.stringify(data));
    return metaBuffer;
}
function createMetaData(totalBytes, url, path, count) {
    var MAX_BUFFER = 512;
    var threads = _.map(_.times(count, _.partial(getThreadRange, count, totalBytes)), createThread);
    return {totalBytes, url, path, threads};
}
function getThreadRange(count, total, index) {
    var bytesPerThread = Math.round(total / count),
        start = Math.floor(bytesPerThread * index),
        end = count - index === 1 ? total : start + bytesPerThread - 1;
    return {start, end}
}

var httpRequest = function (params, onData) {
    var defer = Promise.defer();
    request(params)
        .on('data', asyncFunc(defer.reject, onData))
        .on('complete', defer.resolve)
        .on('error', defer.reject);
    return defer.promise;
};

function download(options) {
    options = _.assign(options, defaultOptions);
    options.path += '.mtd';
    return {
        start: co.wrap(function * (url) {
            var size = getLength(yield requestHead(url)),
                meta = createMetaData(size, url, options.path, defaultOptions.threadCount),

                fd = yield createFileDescriptor(options.path),
                _fsWrite = _.partial(writeData, fd),
                _fsTruncate = _.partial(fsTruncate, fd),
                rangeHeader = _.partial(createRangeHeader, defaultOptions.threadCount, size);

            var temp = function (i) {
                var thread = meta.threads[i],
                    position = thread.start;
                var onData = function * (buffer) {
                    var writePosition = position;
                    position += buffer.length;
                    yield _fsWrite(buffer, writePosition);
                    thread.updatePosition(buffer.length);
                    yield _fsWrite(toBuffer(meta), size + 1);
                };

                return Promise.all([
                    httpRequest({url, headers: rangeHeader(i)}, onData),
                    thread.defer.promise
                ])
            };
            var iterable = _.times(defaultOptions.threadCount, temp);
            return yield Promise.all(iterable).then(co.wrap(function * () {
                yield _fsTruncate(size);
                yield fsRename(options.path, options.path.replace('.mtd', ''));
            }));
        })
    }
}

exports.download = download;