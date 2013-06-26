var Url = require('url');
var Http = require('http');

var _makeHeadRequest = function() {
	var self = this;

	var onHead = function(response) {
		//console.log(response);
		var fileSize = Number(response.headers['content-length']);
		if(isNaN(fileSize)){
			throw 'File size could not be retrived';
		}
		var contentType = response.headers['content-type'];
		response.destroy();
		self.callback({
			fileSize: fileSize,
			contentType: contentType
		});
	};

	requestOptions = {
		hostname: this.url.hostname,
		path: this.url.path,
		method: 'HEAD'
	};


	Http.request(requestOptions, onHead).on('error', self.onError).end();
};

var _execute = function() {
	_makeHeadRequest.call(this);
};

var Downloader = function(url) {
	this.url = Url.parse(url);
};



Downloader.prototype.execute = _execute;
Downloader.prototype.callback = function() {};
Downloader.prototype.onError = function(err) {
	console.error('HeadRequestError:', err);
};


module.exports = Downloader;