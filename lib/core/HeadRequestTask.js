var Url = require('url');
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

	Url.http.request(requestOptions, onHead).on('error', this.onError).end();
};

var _execute = function() {
	_makeHeadRequest.call(this);
};

var Downloader = function(url) {
	this.url = this.requires.url.parse(url);
};



Downloader.prototype.execute = _execute;
Downloader.prototype.callback = function() {};


module.exports = Downloader;