/**
 * Created by tusharmathur on 7/14/15.
 */
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
