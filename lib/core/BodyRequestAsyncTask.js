var Http = require('http');
var Url = require('url');

var BodyDownloader = function(url, header, onData, options) {

	this.url = Url.parse(url);
	this.header = header;
	this.onData = onData;
	options = options || {};
	this.method = options.method;
	this.port = options.port;
	//console.log(this);
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
		method: this.method,
		port: this.port
	};
	Http.request(requestOptions, _onStart).on('error', this.onError).end();
};

BodyDownloader.prototype.onError = function(e) {
	console.error('BodyRequestTask Failure:', e);
};
BodyDownloader.prototype.execute = _start;

//BodyDownloader.prototype.callback = function() {};
//BodyDownloader.prototype.onEnd = function() {};

module.exports = BodyDownloader;