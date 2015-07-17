"use strict";
var _ = require('lodash'),
    request = require('request'),
    co = require('co');

class Queue {
    constructor() {
        var cb, queue = [], defer = Promise.defer();
        this.promise = defer.promise;
        this._write = function (buff) {
            queue.push(co.wrap(cb)(buff));
        };
        this._close = function () {
            try {
                Promise.all(queue).then(defer.resolve, defer.reject);
            } catch (e) {
                defer.reject(e);
            }
        };
        this.map = function (_cb) {
            cb = _cb;
            return this.promise;
        }
    }
}
module.exports = function (url, headers) {
    var queue = new Queue();
    request({url, headers})
        .on('data', queue._write)
        .on('complete', queue._close);
    return queue;
};