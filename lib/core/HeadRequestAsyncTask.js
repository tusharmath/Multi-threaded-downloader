var Url = require('url');
var Http = require('http');

var _makeHeadRequest = function() {
	var self = this;

	var onHead = function(response) {
		self.fileSize = response.headers['content-length'];
		self.contentType = response.headers['content-type'];

		response.destroy();
		self.callback(self);
	};

	requestOptions = {
		hostname: this.url.hostname,
		path: this.url.path,
		method: 'HEAD'
	};


	Http.request(requestOptions, onHead).on('error', self.onError).end();
};

var _execute = function() {
	_makeHeadRequest.call(this);
};

var Downloader = function(url) {
	this.url = Url.parse(url);
};



Downloader.prototype.execute = _execute;
Downloader.prototype.callback = function() {};
Downloader.prototype.onError = function() {};


module.exports = Downloader;