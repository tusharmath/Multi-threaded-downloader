/**
 * Created by tusharmathur on 7/14/15.
 */
"use strict";

function Queue() {
    var _queue = [],
        _queueRequests = [];
    this.write = function (buffer) {
        if (_queueRequests.length > 0) {
            let node = _queueRequests.shift();
            node.resolve(buffer);
        } else {
            _queue.push(Promise.resolve(buffer));
        }
    };
    this.read = function () {
        if (_queue.length > 0) {
            return _queue.shift();
        } else {
            let defer = Promise.defer();
            _queueRequests.push(defer);
            return defer.promise;
        }
    };
    this.hasData = function () {
        return _queue.length > 0;
    };
}
module.exports = Queue;