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
    fsOpen = (path) => utils.promisify(fs.open)(path, 'w+'),
    getLength = (res) => parseInt(res.headers['content-length'], 10),
    rangeHeader = (thread) => ({'range': `bytes=${thread.start}-${thread.end}`});

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
        _ranges = utils.sliceRange(threadCount, size),
        _positions = _.pluck(_ranges, 'start'),
        _writeAt = _.clone(_positions);
    yield _.map(_ranges, function * (range, i) {
        let responseStream = yield _httpRequestRange(range);
        for (let buffer of responseStream.read()) {
            if (buffer) {
                let writePosition = _writeAt[i];
                _writeAt[i] += buffer.length;
                yield _write(buffer, writePosition);
                _positions[i] += buffer.length;
                meta.positions = _positions;
                yield _write(utils.toBuffer(meta, MAX_BUFFER), size + 1);
            }else{
                yield utils.delay(500);
            }
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