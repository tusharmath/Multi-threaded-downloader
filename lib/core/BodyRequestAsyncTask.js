var Http = require('http');
var Url = require('url');

var BodyDownloader = function(url, header, onData, options) {
	this.url = Url.parse(url);
	this.header = header;
	this.onData = onData;

	this.method = options.method || 'GET';
};

var _start = function() {
	var self = this;

	var _onStart = function(response) {
		response.addListener('end', self.callback);
		response.addListener('data', self.onData);
	};

	var requestOptions = {
		headers: {
			range: this.header
		},
		hostname: this.url.hostname,
		path: this.url.path,
		method: this.method
	};
	Http.request(requestOptions, _onStart).on('error', this.onError);
};

BodyDownloader.prototype.onError = function(e) {
	console.error('BodyRequestTask Failure:', e);
};
BodyDownloader.prototype.execute = _start;

//BodyDownloader.prototype.callback = function() {};
//BodyDownloader.prototype.onEnd = function() {};

module.exports = BodyDownloader;