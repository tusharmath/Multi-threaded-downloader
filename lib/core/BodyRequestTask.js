var Http = require('http');
var Url = require('url');

var BodyDownloader = function(options) {
	this.url = Url.parse(options.url);
	this.header = options.header;
	this.method = options.method || 'GET';
};

var _start = function() {
	var self = this;

	var _onStart = function(response) {
		//response.addListener('end', _onEnd);
		response.addListener('data', self.callback);
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

BodyDownloader.prototype.onError = function() {};
BodyDownloader.prototype.execute = _start;
BodyDownloader.prototype.callback = function() {};

module.exports = BodyDownloader;