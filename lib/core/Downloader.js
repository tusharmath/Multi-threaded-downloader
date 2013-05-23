//Helper Methods
var onError = function(e) {
	console.log("Download Error: ", e);
};

var _makeHeadRequest = function() {};

var _startDownload = function() {
	this.options.url = this.requires.url.parse(this.options.url);

};

var Downloader = function(options) {
	//INIT
	//console.log(options);
	this.requires = options.requires;
	this.url = options.url;
	this.threads = options.threads;


	this.requires.http.globalAgent.maxSockets = 200;
	this.requires.http.Agent.defaultMaxSockets = 200;
};


Downloader.prototype.onData = function() {};
Downloader.prototype.onEnd = function() {};
Downloader.prototype.start = _startDownload;


module.exports = Downloader;