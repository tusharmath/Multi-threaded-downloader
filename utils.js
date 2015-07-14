/**
 * Created by tusharmathur on 7/14/15.
 */
"use strict";
var _ = require('lodash');
exports.promisify = function (func) {
    var defer = Promise.defer(),
        handle = (err, data) => err ? defer.reject(err) : defer.resolve(data);
    return _.restParam(function (args) {
        args.push(handle);
        func.apply(null, args);
        return defer.promise;
    });
};

exports.toBuffer = function (obj, size) {
    var buffer = new Buffer(size);
    _.fill(buffer, null);
    buffer.write(JSON.stringify(obj));
    return buffer;
};

exports.sliceRange = function (count, total) {
    var bytesPerThread = _.round(total / count);
    return _.times(count, function (index) {
        var start = bytesPerThread * index,
            end = count - index === 1 ? total : start + bytesPerThread - 1;
        return {start, end}
    });
};

exports.delay = function (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout);
    });
};