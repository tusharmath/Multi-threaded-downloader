/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    utils = require('./lib/Utility'),
    request = require('request'),
    HttpRequest = require('./lib/HttpRequest'),
    co = require('co'),
    MAX_BUFFER = 128,
    MIN_WAIT = 500;

var defaultOptions = {
    headers: {},
    threadCount: 3
};
var fsTruncate = utils.promisify(fs.truncate),
    fsRename = utils.promisify(fs.rename),
    requestHead = utils.promisify(request.head),
    fsWrite = (fd, buffer, position) => utils.promisify(fs.write)(fd, buffer, 0, buffer.length, position),
    fsOpen = (path) => utils.promisify(fs.open)(path, 'w+'),
    getLength = (res) => parseInt(res.headers['content-length'], 10),
    rangeHeader = (thread) => ({'range': `bytes=${thread.start}-${thread.end}`}),
    toBuffer = _.partial(utils.toBuffer, MAX_BUFFER);

function * download(options) {
    var url = options.url,
        threadCount = options.threadCount,
        path = options.path,
        size = getLength(yield requestHead(url)),
        fd = yield fsOpen(path),
        _fsTruncate = _.partial(fsTruncate, fd, size),
        _fsWrite = _.partial(fsWrite, fd),
        _httpRequest = _.partial(HttpRequest, url),
        _httpRequestRange = _.flowRight(_httpRequest, rangeHeader),
        _fsRename = _.partial(fsRename, path, path.replace('.mtd', '')),
        _ranges = utils.sliceRange(threadCount, size),
        meta = {url, path: path, positions: _.pluck(_ranges, 'start')};
    yield _.map(_ranges, function * (range, i) {
        let position = range.start,
            response = yield _httpRequestRange(range);

        var onBuffer = function *(buffer) {
            if (buffer) {
                let writable = _fsWrite(buffer, position);
                position += buffer.length;
                meta.positions[i] += yield writable;
                yield _fsWrite(toBuffer(MAX_BUFFER), size + 1);
            } else {
                yield utils.wait(MIN_WAIT);
            }
        };
        yield utils.map(response.stream, onBuffer);
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