const u = require('./utils');
const _ = require('lodash');
const request = require('request');

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
        //Logical Functs
        var totalBytes,
            position = 0,
            downloadedBytes = 0,
            flux = u.flux(),
            url = this.url,
            headers = this.options.headers,
            onError = function (err) {
                throw err;
            };

        //THUNKS
        var writeDataToMtdFile;
        var stripException = _.partial(u.stripError, onError);

        var TRIGGER_FILE_OPEN = stripException(_.partial(flux.trigger, 'file.open'));
        var TRIGGER_DATA_SAVE = stripException(_.partial(flux.trigger, 'data.save'));
        var TRIGGER_DATA_RECEIVE = _.partial(flux.trigger, 'data.receive');
        var TRIGGER_DATA_START = _.partial(flux.trigger, 'data.start');

        //Handlers
        var handlers = {
            'file.open': function (fd) {
                writeDataToMtdFile = _.partial(u.writeToFile, fd);
                request(url, headers)
                    .on('error', onError).on('data', TRIGGER_DATA_RECEIVE).on('response', TRIGGER_DATA_START);
            },

            'data.start': function (res) {
                totalBytes = u.getResponseSize(res);
            },

            'data.receive': function (data) {
                position = writeDataToMtdFile(data, position, TRIGGER_DATA_SAVE);
            },

            'data.save': function (bytes) {
                downloadedBytes += bytes;
                if (totalBytes === downloadedBytes) {
                    callback();
                }
            },
            'init': function (){
                u.openFile(this.file, 'w+', TRIGGER_FILE_OPEN);
            }
        };
        flux.load(handlers, this);



    }


    stop() {

    }

}

module.exports = Downloader;