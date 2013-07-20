var Http = require('http');
var Url = require('url');
var e = require('../Exceptions');

var BodyDownloader = function(url, start, end, options) {

	this.url = Url.parse(url);
	this.header = 'bytes=' + start + '-' + end;
	options = options || {};
	this.method = options.method;
	this.port = options.port;
	this.startByte = start;
	this.endByte = end;
};

var _start = function(callback) {
	var self = this;
	self.callback = callback;
	var onError = this.callback.bind(this);

	var _onStart = function(response) {
		var destroy = response.destroy.bind(response);

		self.callback(null, {
			event: 'response',
			destroy: destroy
		});

		response.addListener('data', function(chunk) {
			self.callback(null, {
				data: chunk,
				event: 'data'
			});
		});

		response.addListener('end', function(chunk) {
			self.callback(null, {
				event: 'end'
			});
		});


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
	Http.request(requestOptions, _onStart).on('error', onError).end();
};

BodyDownloader.prototype.onError = function(e) {
	this.callback(e);
};
BodyDownloader.prototype.execute = _start;

module.exports = BodyDownloader;