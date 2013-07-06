var Http = require('http');
var Url = require('url');
var e = require('../Exceptions');

var BodyDownloader = function(url, start, end, onData, options) {

	this.url = Url.parse(url);
	this.header = 'bytes=' + start + '-' + end;
	this.onData = onData;
	options = options || {};
	this.method = options.method;
	this.port = options.port;
	this.startByte = start;
	this.endByte = end;
	//console.log(this);
};

var _start = function() {
	var self = this;
	if (this.start == this.endByte) {
		self.callback();
		return;
	}

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
	this.callback(e(1002));
};
BodyDownloader.prototype.execute = _start;

//BodyDownloader.prototype.callback = function() {};
//BodyDownloader.prototype.onEnd = function() {};

module.exports = BodyDownloader;