var Url = require('url');
var Http = require('http');
var e = require('../Exceptions');


var HeadRequest = function(url) {
	//console.log('in head:', head);

	this.url = Url.parse(url);
};


var _execute = function() {
	var self = this;
	Http.globalAgent.maxSockets = 200;
	Http.Agent.defaultMaxSockets = 200;

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
		hostname: this.url.hostname,
		path: this.url.path,
		method: 'HEAD'
	};

	Http.request(requestOptions, onHead).on('error', self.onError).end();
};


HeadRequest.prototype.execute = _execute;
HeadRequest.prototype.onError = function(err) {
	this.callback(e(1004, this.url.path));
};


module.exports = HeadRequest;