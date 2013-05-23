var _makeHeadRequest = function() {
	var self = this;

	var onHead = function(response) {
		self.fileSize = response.headers['content-length'];
		self.contentType = response.headers['content-type'];

		response.destroy();
		self.onStart(self);
	};

	requestOptions = {
		hostname: this.url.hostname,
		path: this.url.path,
		method: 'HEAD'
	};
	this.requires.http.request(requestOptions, onHead).on('error', this.onError).end();
};

var _start = function() {
	_makeHeadRequest.call(this);
};

var Downloader = function(options) {
	//INIT
	//console.log(options);
	this.requires = options.requires;
	this.url = this.requires.url.parse(options.url);
};



Downloader.prototype.onEnd = function() {};
Downloader.prototype.onError = function() {};
Downloader.prototype.start = _start;


module.exports = Downloader;