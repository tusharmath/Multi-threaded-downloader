"use strict";
var express = require('express'),
    app = express(),
    port = 3000;

var defer = Promise.defer();
app.use(express.static(__dirname + '/test/mock'));
exports.start = function () {
    app.listen(port, defer.resolve);
    return defer.promise;
};
exports.stop = ()=> app.close;
