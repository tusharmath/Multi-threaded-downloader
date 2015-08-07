var Url = require('url');
var Http = require('http');
var e = require('../Exceptions');

var HeadRequest = function (url, options) {
	options = options || {};

	this.url = Url.parse(url);
	this.port = options.port || 80;
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

		var result = {
			fileSize: fileSize,
			headers: response.headers
		};
		self.callback(null, result);
	};

    // use http proxy if configured
    // source from: http://stackoverflow.com/questions/3862813/how-can-i-use-an-http-proxy-with-node-js-http-client
    var match;
    if (process.env.http_proxy != null) {
        match = process.env.http_proxy.match(/^(http:\/\/)?([^:\/]+)(:([0-9]+))?/i);
        if (match) {
            requestOptions = {
                host: match[2],
                port: (match[4] != null ? match[4] : 80),
                path: Url.format(self.url),
                method: 'HEAD',
                headers: self.headers
            };
        }    
    } else {
	requestOptions = {
		hostname: self.url.hostname,
		path: self.url.path,
		method: 'HEAD',
		port: self.port,
		headers: self.headers
	};
    }
	Http.request(requestOptions, onHead)
		.on('error', onError)
		.end();
};

HeadRequest.prototype.execute = _execute;
HeadRequest.prototype.onError = function (err) {
	this.callback(e(1004, this.url.host, err));
};

module.exports = HeadRequest;
