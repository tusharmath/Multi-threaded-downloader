var _ = require('underscore');
var u = require('../Utils');
var DownloadWriter = require('./DownloadWriterAsyncTask');
var BodyRequest = require('./BodyRequestAsyncTask');
var MetaDataBuilder = require('./MetaDataBuilderSyncTask');
var DownloadTimeout = require('./DownloadTimeoutTask');

var ExecutorGenerator = function(fd, threads, fileSize, url, method, port, cParams) {
    this.fd = fd;
    this.threads = threads;
    this.fileSize = fileSize;
    this.url = url;
    this.method = method;
    this.port = port;
    this.cParams = cParams || {};
};

ExecutorGenerator.prototype.execute = function(callback) {
    var executor = {};
    var self = this;
    executor.writer = u.executor(DownloadWriter, self.fd);
    executor.timer = u.executor(DownloadTimeout, self.threads, self.cParams);
    executor.metaBuilder = u.executor(MetaDataBuilder, self.threads, self.fileSize, self.url, self.method, self.port, self.cParams);

    _.each(self.threads, function(item) {
        item.bodyRequest = u.executor(BodyRequest, self.url, item.position, item.end, self.cParams);
    });
    executor.threads = this.threads;
    callback(null, executor);
};

module.exports = ExecutorGenerator;

/*
1. Executor
2. Timeout
3. Package
4. 

*/