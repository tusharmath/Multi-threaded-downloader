/**
 * Created by tusharmathur on 5/15/15.
 */
"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    utils = require('./lib/Utility'),
    request = require('request'),
    rx = require('rx'),
    HttpRequest = require('./lib/HttpRequest'),
    co = require('co'),
    MAX_BUFFER = 512,
    MIN_WAIT = 1;

var defaultOptions = {
    headers: {},
    threadCount: 3
};
var fsTruncate = utils.promisify(fs.truncate),
    fsRename = utils.promisify(fs.rename),
    requestHead = utils.promisify(request.head),
    fsWrite = (fd, buffer, position) => utils.promisify(fs.write)(fd, buffer, 0, buffer.length, position),
    fsWriteObservable = rx.Observable.fromCallback(fs.write),
    fsTruncateObservable = rx.Observable.fromCallback(fs.truncate),
    fsRenameObservable = rx.Observable.fromCallback(fs.rename),
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
        _fsTruncate = ()=> fsTruncateObservable(fd, size),
        _fsRename = function () {
            return fsRenameObservable(path, path.replace('.mtd', ''))
        },
        _httpRequest = _.partial(HttpRequest, url),
        _httpRequestRange = _.flowRight(_httpRequest, rangeHeader),
        _ranges = utils.sliceRange(threadCount, size),
        _meta = metaCreate(url, path, _ranges),
        _bufferThread = _.curry(function (thread, buffer) {
            return {buffer, thread};
        }),
        _threadPacket = function (range, thread) {
            return _httpRequestRange(range).map(_bufferThread(thread));
        },
        _attachPacketPosition = function (packet) {
            packet.position = _meta.nextByte[packet.thread];
            _updateNextByte(packet);
            return packet;
        },
        _updateNextByte = function (packet) {
            _meta.nextByte[packet.thread] += packet.buffer.length;
        },
        _updatePosition = function (packet) {
            _meta.positions[packet.thread] += packet.buffer.length;
        },
        _fsWrite = function (fd, buffer, position) {
            return fsWriteObservable(fd, buffer, 0, buffer.length, position);
        }
        ;
    var defer = Promise.defer();
    rx.Observable
        .from(_ranges)
        .selectMany(_threadPacket)
        .select(_attachPacketPosition)
        .selectMany(packet => _fsWrite(fd, packet.buffer, packet.position), _.identity)
        .select(_updatePosition)
        .selectMany(() => _fsWrite(fd, toBuffer(_meta), size))
        .last()
        .selectMany(_fsTruncate)
        .selectMany(_fsRename)
       .subscribe(defer.resolve, defer.reject);

    yield defer.promise;
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