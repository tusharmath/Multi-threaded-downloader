var a = require('async');
var _ = require('underscore');
var u = require('../Utils');
var DownloadWriter = require('./DownloadWriterAsyncTask');
var BodyRequest = require('./BodyRequestAsyncTask');
var Timeout = require('./DownloadTimeoutTask');
var MetaDataBuilder = require('./MetaDataBuilderSyncTask');


var DataRequest = function(url, threads, fd, fileSize, cParams) {
    this.url = url;
    this.threads = threads;
    this.fileSize = fileSize;
    this.fd = fd;
    this.cParams = cParams;
};


DataRequest.prototype.execute = function(callback) {
    var self = this;
    self.callback = callback;
    self.responses = [];
    var cParams = self.cParams;

    var _onTimeout = function(err) {
        //console.log('Responses:', self.responses[0].destory);
        _.invoke(self.responses, 'destroy');
        self.callback(err);
    };

    self.timeout = new Timeout(self.threads, cParams);
    self.timeout.start(_onTimeout);

    a.each(this.threads, function(item, callback) {

        var writer = u.executor(DownloadWriter, self.fd);
        //BODY REQUEST

        var _onMetaBuild = function(err, response) {
            writer(response.data, response.position);
        };

        var _onResponse = function(err, response) {
            self.responses.push(response);
        };

        var _bodyCallback = function(err, response) {

            u.executor(MetaDataBuilder, self.threads,
            self.fileSize,
            self.url,
            cParams.method,
            cParams.port,
            cParams)(_onMetaBuild);

            writer(response.data, item.position);
            item.position += response.data.length;

            if (item.position >= item.end) {
                item.position = item.end;
                callback();
            }
            if (cParams.onData) cParams.onData(self.threads);

        };
        u.executor(BodyRequest, self.url, item.position, item.end, _onResponse, cParams)(_bodyCallback);

    }, function() {
        self.timeout.stop();
        self.callback();
    });
    if (cParams.onStart) cParams.onStart({
        url: self.url,
        size: self.fileSize,
        threads: self.threads
    });
};

module.exports = DataRequest;