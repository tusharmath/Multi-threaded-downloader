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

var saveData = function * (thread, meta, size, writer, buffer) {
    yield writer(buffer, thread.writeAt(buffer.length));
    thread.updatePosition(buffer.length);
    yield writer(toBuffer(meta), size + 1);
};

var zeroAryPartial = _.flow(_.partial, _.partial(_.rearg(_.ary, 1, 0), 0));

function * download(options) {
    var url = options.url;
    var size = getLength(yield requestHead(url)),
        meta = createMetaData(size, url, options.path, defaultOptions.threadCount),
        fd = yield createFileDescriptor(options.path),
        _fsWrite = _.partial(writeData, fd),
        _fsTruncate = zeroAryPartial(fsTruncate, fd, size),
        _fsRename = zeroAryPartial(fsRename, options.path, options.path.replace('.mtd', '')),
        rangeHeader = _.partial(createRangeHeader, defaultOptions.threadCount, size);
    var requestParams = function (i) {
        var thread = meta.threads[i];
        var onData = _.partial(saveData, thread, meta, size, _fsWrite);
        return [{url, headers: rangeHeader(i)}, onData]
    };

    var temp = function (threads, requestParams, i) {
        return Promise.all([
            httpRequest.apply(null, requestParams(i)),
            threads[i].defer.promise
        ])
    };
    var iterable = _.times(defaultOptions.threadCount, _.partial(temp, meta.threads, requestParams));
    return yield Promise.all(iterable).then(_fsTruncate).then(_fsRename);

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