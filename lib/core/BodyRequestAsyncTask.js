var Http = require('http');
var Https = require('https');
var Url = require('url');
var e = require('../Exceptions');

var BodyDownloader = function (url, start, end, options) {

	this.url = Url.parse(url);
	this.rangeHeader = 'bytes=' + start + '-' + end;
	options = options || {};
	this.method = options.method;
	this.port = options.port;

	// support https download start
	this.https = false;
	if (url.indexOf("https://") > -1){
		this.port = 443;
		this.https = true;
	}
	// suport https download end

	this.startByte = start;
	this.endByte = end;
	this.headers = options.headers || {};
};

var _start = function (callback) {
	var self = this;
	self.callback = callback;
	if (self.startByte >= self.endByte) {
		self.callback(null, {
			event: 'end'
		});
		return;
	}

	var onError = self.callback.bind(self);

	var _onStart = function (response) {
		var destroy = response.destroy.bind(response);

		self.callback(null, {
			event: 'response',
			destroy: destroy
		});

		response.addListener('data', function (chunk) {
			self.callback(null, {
				data: chunk,
				event: 'data'
			});
		});

		response.addListener('end', function (chunk) {
			self.callback(null, {
				event: 'end'
			});
		});

	};

	this.headers.range = this.rangeHeader
	var requestOptions = {
		headers: this.headers,
		hostname: this.url.hostname,
		path: this.url.path,
		method: this.method,
		port: this.port
	};
	if (self.https){
		Https.request(requestOptions, _onStart)
			.on('error', onError)
			.end();
	} else {
		Http.request(requestOptions, _onStart)
			.on('error', onError)
			.end();
	}

};

BodyDownloader.prototype.onError = function (e) {
	this.callback(e);
};
BodyDownloader.prototype.execute = _start;

module.exports = BodyDownloader;
