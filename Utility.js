/**
 * Created by tusharmathur on 6/25/15.
 */
var fs = require('fs'),
    _ = require('lodash'),
    request = require('request'),
    co = require('co');

var u = {
    async: function (onError, func) {
        var coFunc = co.wrap(func);
        return function () {
            try {
                coFunc.apply(null, arguments).catch(onError);
            } catch (e) {
                onError(e);
            }
        };
    },
    promisify: function (func) {
        var defer = Promise.defer(),
            handle = function (err, data) {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(data);
                }
            };
        return _.restParam(function (args) {
            args.push(handle);
            func.apply(null, args);
            return defer.promise;
        })
    }
};

u.fsWrite = u.promisify(fs.write);
u.fsOpen = u.promisify(fs.open);
u.fsTruncate = u.promisify(fs.truncate);
u.fsRename = u.promisify(fs.rename);
u.requestHead = u.promisify(request.head);
u.writeData = function (fd, buffer, position) {
    return u.fsWrite(fd, buffer, 0, buffer.length, position);
};
u.getTotalBytesFromResponse = function (headResponse) {
    return parseInt(headResponse.headers['content-length'], 10);
};
u.createFileDescriptor = function (options) {
    return u.fsOpen(options.path, 'w+');
};
u.createMetaData = function (totalBytes, url, path, count) {
    var MAX_BUFFER = 512;
    var threads = _.fill(_.times(count), {});
    var data = {totalBytes, url, path, threads};
    return {
        toBuffer: function () {
            var metaBuffer = new Buffer(MAX_BUFFER);
            _.fill(metaBuffer, null);
            metaBuffer.write(JSON.stringify(data));
            return metaBuffer;
        },
        thread: function (index) {
            var _this = this;
            return {
                getPosition: function () {
                    return data.threads[index].position;
                },
                updatePosition: function (distance) {
                    data.threads[index].position += distance;
                },
                setRange: function (range) {
                    var thread = data.threads[index];
                    thread.start = range.start;
                    thread.end = range.end;
                    thread.position = range.start;
                }
            }
        }

    }
};
u.getThreadRange = function (count, index, total) {
    var bytesPerThread = Math.round(total / count),
        start = Math.floor(bytesPerThread * index),
        end = count - index === 1 ? total : start + bytesPerThread - 1;
    return {start, end}
};
module.exports = u;