/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    utils = require('./utils'),
    request = require('request'),
    HttpRequest = require('./HttpRequest'),
    co = require('co'),
    MAX_BUFFER = 128;

var defaultOptions = {
    headers: {},
    threadCount: 10
};
var fsTruncate = utils.promisify(fs.truncate),
    fsRename = utils.promisify(fs.rename),
    requestHead = utils.promisify(request.head),
    fsWrite = (fd, buffer, position) => utils.promisify(fs.write)(fd, buffer, 0, buffer.length, position),
    fsOpen = (path) => utils.promisify(fs.open)(path, 'w+');

var getLength = (res) => parseInt(res.headers['content-length'], 10);
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
function byteRange(count, total, index) {
    var bytesPerThread = Math.round(total / count),
        start = Math.floor(bytesPerThread * index),
        end = count - index === 1 ? total : start + bytesPerThread - 1;
    return {start, end}
}
var bytesPerThread = (threadCount, size) => Math.floor(size / threadCount);
function * download(options) {
    var url = options.url,
        threadCount = options.threadCount,
        path = options.path,
        size = getLength(yield requestHead(url)),
        meta = {url, path: path, threads: []},
        fd = yield fsOpen(path),
        _fsTruncate = _.partial(fsTruncate, fd, size),
        _write = _.partial(fsWrite, fd),
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
            yield _write(utils.toBuffer(meta, MAX_BUFFER), size + 1);
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