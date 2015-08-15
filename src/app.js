/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict';
var fs = require('fs'),
    _ = require('lodash'),
    utils = require('./lib/Utility'),
    rx = require('rx'),
    ob = require('./lib/Observables'),
    co = require('co'),
    MAX_BUFFER = 512;

var defaultOptions = {
    headers: {},
    threadCount: 3
};
var getLength = (res) => parseInt(res.headers['content-length'], 10),
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
        size = getLength(yield ob.requestHead(url)),
        fd = (yield ob.fsOpen(path, 'w+').toPromise())[1],
        _fsTruncate = ()=> ob.fsTruncate(fd, size),
        _fsRename = function () {
            return ob.fsRename(path, path.replace('.mtd', ''));
        },
        _httpRequest = _.partial(ob.requestBody, url),
        _httpRequestRange = _.flowRight(_httpRequest, rangeHeader),
        _ranges = utils.sliceRange(threadCount, size),
        _meta = metaCreate(url, path, _ranges),
        _attachThread = _.curry(function (thread, buffer) {
            return {buffer, thread};
        }),
        _httpRequestThread = function (range, thread) {
            return _httpRequestRange(range).map(_attachThread(thread));
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
            return ob.fsWrite(fd, buffer, 0, buffer.length, position);
        }
        ;

    yield rx.Observable
        .from(_ranges)
        .selectMany(_httpRequestThread)
        .select(_attachPacketPosition)
        .selectMany(packet => _fsWrite(fd, packet.buffer, packet.position), _.identity)
        .select(_updatePosition)
        .selectMany(() => _fsWrite(fd, toBuffer(_meta), size))
        .last()
        .selectMany(_fsTruncate)
        .selectMany(_fsRename)
        .toPromise();

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