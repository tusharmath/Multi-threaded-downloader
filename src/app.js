/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict';
var _ = require('lodash'),
    utils = require('./lib/Utility'),
    Rx = require('Rx'),
    ob = require('./lib/Observables'),
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
        size = getLength(yield ob.requestHeadAsync(url)),
        fd = yield ob.fsOpenAsync(path, 'w+'),
        _httpRequest = _.partial(ob.requestBody, url),
        _httpRequestRange = _.flowRight(_httpRequest, rangeHeader),
        _meta = metaCreate(url, path, utils.sliceRange(threadCount, size)),
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
        };

    yield Rx.Observable.from(utils.sliceRange(threadCount, size))
        .selectMany(_httpRequestThread)
        .select(_attachPacketPosition)
        .selectMany(packet => _fsWrite(fd, packet.buffer, packet.position), _.identity)
        .select(_updatePosition)
        .selectMany(() => _fsWrite(fd, toBuffer(_meta), size))
        .last()
        .selectMany(()=> ob.fsTruncate(fd, size))
        .selectMany(()=> ob.fsRename(path, path.replace('.mtd', '')))
        .toPromise();

    return _meta;
}

class Download {
    constructor(options) {
        this.options = _.assign(options, defaultOptions);
        this.options.path += '.mtd';
    }

    start() {
        return Rx.Observable.spawn(download.bind(null, this.options)).toPromise();
    }
}
module.exports = Download;