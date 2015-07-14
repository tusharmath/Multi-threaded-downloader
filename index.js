/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    request = require('request'),
    HttpRequest = require('./HttpRequest'),
    co = require('co'),
    MAX_BUFFER = 128;

var defaultOptions = {
    headers: {},
    threadCount: 10
};
var fsWrite = promisify(fs.write),
    fsTruncate = promisify(fs.truncate),
    fsRename = promisify(fs.rename),
    requestHead = promisify(request.head);

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

var writerThreadOnReject = _.partial(_.rearg(_.get, 1, 0), 'defer.reject');
var invoke = (invocationList) => _.partial(_.invoke, invocationList, _.call, null);
var bytesPerThread = (threadCount, size) => Math.floor(size / threadCount);

var createThreadStartPositions = function (threadCount, size) {
    var _bytesPerThread = bytesPerThread(threadCount, size);
    return _.times(threadCount, (x)=> x * _bytesPerThread);
};
var createThreadEndPositions = function (threadCount, size) {
    var _bytesPerThread = bytesPerThread(threadCount, size);
    var positions = _.times(threadCount, (x)=> (x + 1) * _bytesPerThread - 1);
    positions[positions.length - 1] = size;
    return positions;
};
var iterate = function * (list, func) {
    var count = 0;
    for (var i of list) {
        yield func(i, count++, list);
    }
};
function * download(options) {
    var url = options.url,
        threadCount = options.threadCount,
        path = options.path,
        size = getLength(yield requestHead(url)),
        meta = {url, path: path, threads: []},
        fd = yield fsOpen(path),
        _fsTruncate = _.partial(fsTruncate, fd, size),
        _write = _.partial(writeData, fd),
        _httpRequest = _.partial(HttpRequest, url),
        _httpRequestRange = _.flowRight(_httpRequest, rangeHeader),
        _fsRename = _.partial(fsRename, path, path.replace('.mtd', '')),
        _byteRange = _.partial(byteRange, threadCount, size);
    meta.threads = _.chain(threadCount).times(_byteRange).map(createWriteThread).value();

    yield _.map(meta.threads, function * (thread) {
        let response = yield _httpRequestRange(thread);
        for (let buffer of response.read()) {
            yield _write(buffer, thread.writeAt(buffer.length));
            thread.updatePosition(buffer.length);
            yield _write(toBuffer(meta), size + 1);
        }
    });

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