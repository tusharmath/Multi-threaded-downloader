/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    request = require('request'),
    co = require('co'),
    MAX_BUFFER = 512;

var defaultOptions = {
    headers: {},
    threadCount: 3
};
var fsWrite = promisify(fs.write),
    fsTruncate = promisify(fs.truncate),
    fsRename = promisify(fs.rename),
    requestHead = promisify(request.head);

function asyncCatcher(onError, func) {
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
var fsOpen = (path) => promisify(fs.open)(path, 'w+');
var rangeHeader = (thread) => ({'range': `bytes=${thread.start}-${thread.end}`});
var createWriteThread = function (range) {
    return {
        defer: Promise.defer(),
        start: range.start,
        end: range.end,
        position: range.start,
        nextByte: range.start,
        updatePosition: function (distance) {
            this.position += distance;
            if (this.position >= this.end) {
                this.defer.resolve(this);
            }
        },
        writeAt: function (distance) {
            var writeAt = this.nextByte;
            this.nextByte += distance;
            return writeAt;
        }
    };
};
function toBuffer(data, size) {
    size = size || MAX_BUFFER;
    var metaBuffer = new Buffer(size);
    _.fill(metaBuffer, null);
    metaBuffer.write(JSON.stringify(data));
    return metaBuffer;
}
function byteRange(count, total, index) {
    var bytesPerThread = Math.round(total / count),
        start = Math.floor(bytesPerThread * index),
        end = count - index === 1 ? total : start + bytesPerThread - 1;
    return {start, end}
}
var httpRequest = function (url, headers, onData) {
    var defer = Promise.defer();
    request({url, headers})
        .on('data', onData)
        .on('complete', defer.resolve)
        .on('error', defer.reject);
    return defer.promise;
};
var writerThreadOnReject = _.partial(_.rearg(_.get, 1, 0), 'defer.reject');
var invoke = (invocationList) => _.partial(_.invoke, invocationList, _.call, null);
function * saveData(_fsWrite, meta, size, thread, buffer) {
    yield _fsWrite(buffer, thread.writeAt(buffer.length));
    thread.updatePosition(buffer.length);
    yield _fsWrite(toBuffer(meta), size + 1);
}
function * download(options) {
    var url = options.url,
        threadCount = options.threadCount,
        path = options.path,
        size = getLength(yield requestHead(url)),
        meta = {url, path: path, threads: []},
        fd = yield fsOpen(path),
        _fsTruncate = _.partial(fsTruncate, fd, size),
        _fsRename = _.partial(fsRename, path, path.replace('.mtd', '')),
        _httpRequest = _.spread(_.curry(httpRequest)(url)),
        _asyncCatcher = _.spread(asyncCatcher),
        _write = _.partial(saveData, _.partial(writeData, fd), meta, size),
        _byteRange = _.partial(byteRange, threadCount, size);
    var threads = meta.threads = _(threadCount).times(_byteRange).map(createWriteThread).value();
    var _getAsyncFuncSpreadParams = invoke([writerThreadOnReject, _.curry(_write, 2)]);
    var onResponseData = _.flowRight(_asyncCatcher, _getAsyncFuncSpreadParams);
    var WriterPromises = _.pluck(threads, 'defer.promise');
    var HttpPromises = _(threads)
        .map(invoke([rangeHeader, _.ary(onResponseData, 1)]))
        .map(_httpRequest)
        .value();
    yield _.flatten([WriterPromises, HttpPromises]);
    yield _fsTruncate();
    yield _fsRename();
    return meta;
}

class Download {
    constructor(options) {
        this.options = _.assign(options, defaultOptions);
        this.options.path += '.mtd';
    }

    start() {
        return co.wrap(download)(this.options);
    }
}
module.exports = Download;