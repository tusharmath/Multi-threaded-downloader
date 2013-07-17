var a = require('async');
var _ = require('underscore');
var u = require('../Utils');
var DownloadWriter = require('./DownloadWriterAsyncTask');
var BodyRequest = require('./BodyRequestAsyncTask');
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

	a.each(this.threads, function(item, callback) {

		var writer = u.executor(DownloadWriter, self.fd);

		var _onMetaBuild = function(err, response) {
			writer(response.data, response.position);
		};

		var _bodyCallback = function(err, response) {
			if (err) {
				callback(err);
				return;
			}

			if (response.event == 'data') {
				u.executor(MetaDataBuilder, self.threads, self.fileSize, self.url, cParams.method, cParams.port, cParams)(_onMetaBuild);
				writer(response.data, item.position);
				item.position += response.data.length;

			} else if (response.event == 'end') {
				item.connection = 'closed';
				if (item.position < item.end) {
					item.connection = 'failed';
				}
				callback();
			}

		};

		u.executor(BodyRequest, self.url, item.position, item.end, cParams)(_bodyCallback);

	}, self.callback);


	if (cParams.onStart) cParams.onStart({
		url: self.url,
		size: self.fileSize,
		threads: self.threads
	});
};

module.exports = DataRequest;