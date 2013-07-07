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

	//console.log(this);
};

var _start = function() {
	var self = this;
	if (this.start == this.endByte) {
		self.callback();
		return;
	}

	var _onStart = function(response) {
		self.connection = 'open';

		response.addListener('data', function(chunk) {

			self.callback(null, {
				data: chunk,
				connection: self.connection
			});
		});

		response.addListener('end', function() {
			self.connection = 'closed';
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
	Http.request(requestOptions, _onStart).on('error', this.onError).end();
};

BodyDownloader.prototype.onError = function(e) {
	this.callback(e(1002, this.url));
};
BodyDownloader.prototype.execute = _start;

//BodyDownloader.prototype.callback = function() {};
//BodyDownloader.prototype.onEnd = function() {};

module.exports = BodyDownloader;