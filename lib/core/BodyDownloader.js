var BodyDownloader = function(options) {

	this.requires = options.requires;
	this.url = this.requires.url.parse(options.url);
	this.header = options.header;
	this.threadIndex = options.threadIndex;

};

var _stop = function() {
	this.response.destroy();
	this.onEnd(this.index);
};

var _start = function() {
	var self = this;

	var _onEnd = function() {
		self.onEnd(self.index);
	};
	var _onData = function(data) {

		self.onData(data, self.threadIndex);
	};

	var _onStart = function(response) {
		response.addListener('end', _onEnd);
		response.addListener('data', _onData);
		self.response = response;
		self.onStart(response);
	};

	var requestOptions = {
		headers: {
			range: this.header
		},
		hostname: this.url.hostname,
		path: this.url.path
	};
	this.requires.http.get(requestOptions, _onStart).on('error', this.onError);
};

BodyDownloader.prototype.onData = function() {};
BodyDownloader.prototype.onEnd = function() {};
BodyDownloader.prototype.onStart = function() {};
BodyDownloader.prototype.onError = function() {};
BodyDownloader.prototype.start = _start;
BodyDownloader.prototype.stop = _stop;
module.exports = BodyDownloader;