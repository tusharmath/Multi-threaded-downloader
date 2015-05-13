const u = require('./utils');
const _ = require('lodash');

var defaultOptions = {};

class Downloader {
    constructor(file, url, options) {
        options = options || {};
        this.file = file;
        this.url = url;
        this.options = _.assign(defaultOptions, options);
        this.eventHandlers = {};
    }

    start(callback) {
        var position = 0,
            downloadedBytes = 0,
            totalBytes,
            writeDataToMtdFile;
        //Logical Functs
        var onError = function (err) {
            throw err;
        };
        var onResponseEnd = function () {

        };
        var onMessageWritten = function () {
            if (totalBytes === downloadedBytes) {
                callback();
            }
        };
        var onDataWritten = function (bytes) {
            downloadedBytes += bytes;
            var message = JSON.stringify({position: position});
            writeDataToMtdFile(message, totalBytes, stripException(onMessageWritten))
        };

        var getResponseSize = function (res) {
            return parseInt(res.headers['content-length'], 10);
        };
        var onResponseStarted = function (res) {
            totalBytes = getResponseSize(res);
        };
        //THUNKS
        var stripException = _.partial(u.stripError, onError);
        var makeRequestToUrl = _.partial(u.makeRequest, this.url, this.options.headers, onResponseStarted, onResponseEnd, onError);

        var onResponseData = function (data) {
            position = writeDataToMtdFile(data, position, stripException(onDataWritten));
        };

        var onFileCreated = function (fd) {
            writeDataToMtdFile = _.partial(u.writeToFile, fd);
            makeRequestToUrl(onResponseData);
        };

        u.openFile(this.file + '.mtd', 'w+', stripException(onFileCreated));
    }

    on(event, cb) {
        this.eventHandlers[event] = cb;
    }

    stop() {

    }

}

module.exports = Downloader;