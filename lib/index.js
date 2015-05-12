const Q = require('q');
const _ = require('lodash');
const request = require('request');
const fs = require('fs');

const defaultOptions = {
    threadCount: 4
};

function createWriteStream(path, position) {
    var options = {
        start: position
    };
    return fs.createWriteStream(path, options);
}

function qromise(func) {
    return function (...args) {
        var defer = Q.defer();
        args[func.length] = function (err, res) {
            if (err) {
                return defer.reject(err);
            }
            defer.resolve(res);
        };
        func.apply(null, args);
        defer.promise;
    };
}

var createFileDescriptor = qromise(fs.open)

function createFileDescriptor(path) {
    var defer = Q.defer()
    fs.open(path, 'w+', function (err, fd) {
        if (err) {
            return defer.reject(err);
        }
        defer.resolve(fd);
    });
    return defer.promise;
}

function writeDataAtPositionQ(fd, encoding, position, data) {
    fs.write(fd, data, position, encoding, function (err) {

    })
}

class Downloader {
    constructor(url, file, options) {
        options = options || {};
        this.file = file;
        this.url = url;
        this.options = _.assign(defaultOptions, options);
    }

    start(callback) {

        var createWriteStreamForFile = _.partial(createWriteStream, this.file);

        request(this.url, this.options.headers)
            .on('response', function () {
                console.log('yanki')
            })
            .on('data', function (data) {
                console.log(data.length);
            })
            .pipe(fs.createWriteStream(this.file))

    }

    stop() {

    }

}

module.exports = Downloader;