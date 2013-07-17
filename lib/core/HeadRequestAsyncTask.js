var Url = require('url');
var Http = require('http');
var e = require('../Exceptions');


var HeadRequest = function(url, options) {
	options = options || {};
	//console.log('in head:', head);

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
		//console.log(response);
		var fileSize = Number(response.headers['content-length']);
		if (isNaN(fileSize)) {
			self.onError(e(1008, self.url));
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
    this.callback(err);
};


module.exports = HeadRequest;