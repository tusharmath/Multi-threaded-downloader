var Url = require('url');
var Http = require('http');
var Https = require('https');
var e = require('../Exceptions');

var HeadRequest = function (url, options) {
	options = options || {};

	this.url = Url.parse(url);
	this.port = options.port || 80;

	// support https download start
	this.https = false;
	if (url.indexOf("https://") > -1){
		this.port = 443;
		this.https = true;
	}
	// suport https download end

	this.headers = options.headers || {};
};

var _execute = function (callback) {
	var self = this;
	this.callback = callback;
	Http.globalAgent.maxSockets = 200;
	Http.Agent.defaultMaxSockets = 200;
	var onError = self.onError.bind(self);

	var onHead = function (response) {

		var fileSize = Number(response.headers['content-length']);
		response.destroy();

		if (isNaN(fileSize)) {
			self.callback(e(1008, self.url.host));
			return;
		}
		// add statusCode in head request result
		// to check if download is ok
		var result = {
			fileSize: fileSize,
			statusCode: response.statusCode,
			headers: response.headers
		};
		self.callback(null, result);
	};

	requestOptions = {
		hostname: self.url.hostname,
		path: self.url.path,
		method: 'HEAD',
		port: self.port,
		headers: self.headers
	};
	// support https download start
	if (self.https){
		Https.request(requestOptions, onHead)
			.on('error', onError)
			.end();
	} else {
		Http.request(requestOptions, onHead)
			.on('error', onError)
			.end();
	}
	// suport https download start

};

HeadRequest.prototype.execute = _execute;
HeadRequest.prototype.onError = function (err) {
	this.callback(e(1004, this.url.host));
};

module.exports = HeadRequest;
