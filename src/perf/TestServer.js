"use strict";
var express = require('express'),
    app = express(),
    CHAR = '*',
    port = 3000;

var defer = Promise.defer();
app.get('/chunk/:size.txt', function (req, res) {
    var count = 0,
        size = parseInt(req.params.size);
    while (count < size) {
        res.write(CHAR);
        count++;
    }
    res.send();
}).get('/range/:size.txt', function (req, res) {
    var count = 0,
        str = '',
        size = parseInt(req.params.size);
    while (count < size) {
        str += CHAR;
        count++;
    }
    res.send(str);
});

exports.start = function () {
    app.listen(port, defer.resolve);
    return defer.promise;
};
exports.stop = ()=> app._close;
