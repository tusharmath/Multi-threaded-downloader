var Url = require('url');
var Http = require('http');
var e = require('../Exceptions');


var HeadRequest = function(url, options) {
	options = options || {};

	this.url = Url.parse(url);
	this.port = options.port || 80;
};


var _execute = function(callback) {
	var self = this;
	this.callback = callback;
	Http.globalAgent.maxSockets = 200;
	Http.Agent.defaultMaxSockets = 200;
	var onError = self.onError.bind(self);

	var onHead = function(response) {

		var fileSize = Number(response.headers['content-length']);
		response.destroy();

		if (isNaN(fileSize)) {
			self.callback(e(1008, self.url.host));
			return;
		}
		var contentType = response.headers['content-type'];
		response.destroy();
		var result = {
			fileSize: fileSize,
			contentType: contentType
		};
		self.callback(null, result);
	};

	requestOptions = {
		hostname: self.url.hostname,
		path: self.url.path,
		method: 'HEAD',
		port: self.port
	};

	Http.request(requestOptions, onHead).on('error', onError).end();
};


HeadRequest.prototype.execute = _execute;
HeadRequest.prototype.onError = function(err) {
	this.callback(e(1004, this.url.host));
	};


	module.exports = HeadRequest;