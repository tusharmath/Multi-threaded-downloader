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
    threadCount: 3
};
var fsTruncate = utils.promisify(fs.truncate),
    fsRename = utils.promisify(fs.rename),
    requestHead = utils.promisify(request.head),
    fsWrite = (fd, buffer, position) => utils.promisify(fs.write)(fd, buffer, 0, buffer.length, position),
    fsOpen = (path) => utils.promisify(fs.open)(path, 'w+');

var getLength = (res) => parseInt(res.headers['content-length'], 10);
var rangeHeader = (thread) => ({'range': `bytes=${thread.start}-${thread.end}`});
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
        meta = {url, path: path, positions: []},
        fd = yield fsOpen(path),
        _fsTruncate = _.partial(fsTruncate, fd, size),
        _write = _.partial(fsWrite, fd),
        _httpRequest = _.partial(HttpRequest, url),
        _httpRequestRange = _.flowRight(_httpRequest, rangeHeader),
        _fsRename = _.partial(fsRename, path, path.replace('.mtd', '')),
        _byteRange = _.partial(byteRange, threadCount, size),
        _ranges = _.chain(threadCount).times(_byteRange).value(),
        _positions = _.pluck(_ranges, 'start'),
        _writeAt = _.clone(_positions);
    yield _.map(_ranges, function * (range, i) {
        let response = yield _httpRequestRange(range);
        for (let buffer of response.read()) {
            let writePosition = _writeAt[i];
            _writeAt[i] += buffer.length;
            yield _write(buffer, writePosition);
            _positions[i] += buffer.length;
            meta.positions = _positions;
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