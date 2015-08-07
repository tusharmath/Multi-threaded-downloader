var Http = require('http');
var Url = require('url');
var e = require('../Exceptions');

var BodyDownloader = function (url, start, end, options) {

	this.url = Url.parse(url);
	this.rangeHeader = 'bytes=' + start + '-' + end;
	options = options || {};
	this.method = options.method;
	this.port = options.port;
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
    var requestOptions = {};
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
                method: this.method,
                headers: this.headers
            };
        }    
    } else {
        requestOptions = {
		headers: this.headers,
		hostname: this.url.hostname,
		path: this.url.path,
		method: this.method,
		port: this.port
	};
    }

	Http.request(requestOptions, _onStart)
		.on('error', onError)
		.end();
};

BodyDownloader.prototype.onError = function (e) {
	this.callback(e);
};
BodyDownloader.prototype.execute = _start;

module.exports = BodyDownloader;
