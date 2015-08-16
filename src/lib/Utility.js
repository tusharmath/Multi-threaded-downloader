/**
 * Created by tusharmathur on 7/14/15.
 */
"use strict";
var _ = require('lodash'),
    utility = {};

utility.toBuffer = function (obj, size) {
    var buffer = new Buffer(size);
    _.fill(buffer, null);
    buffer.write(JSON.stringify(obj));
    return buffer;
};

utility.sliceRange = function (count, total) {
    var bytesPerThread = _.round(total / count);
    return _.times(count, function (index) {
        var start = bytesPerThread * index,
            end = count - index === 1 ? total : start + bytesPerThread - 1;
        return {start, end};
    });
};

module.exports = utility;