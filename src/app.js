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
    MAX_BUFFER = 512,
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
    toBuffer = _.partialRight(utils.toBuffer, MAX_BUFFER),
    metaCreate = function (url, path, _ranges) {
        var positions = _.pluck(_ranges, 'start');
        return {url, path: path, nextByte: _.clone(positions), positions};
    };
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
        _meta = metaCreate(url, path, _ranges),
        _onBuffer = _.curry(function * (i, buffer) {
            let writable = _fsWrite(buffer, _meta.nextByte[i]);
            _meta.nextByte[i] += buffer.length;
            _meta.positions[i] += yield writable;
            yield _fsWrite(toBuffer(_meta), size);
        });
    yield _.map(_ranges, function * (range, i) {
        yield _httpRequestRange(range).map(_onBuffer(i)).value();
    });
    yield _fsTruncate();
    yield _fsRename();
    return _meta;
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