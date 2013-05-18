//Helper Methods
var onError = function(e) {
	console.log("Download Error: ", e);
};

var _makeHeadRequest = function() {};

var _startDownload = function() {
	this.options.url = this.requires.url.parse(this.options.url);
	this.options.http.globalAgent.maxSockets = 200;
	this.options.http.Agent.defaultMaxSockets = 200;
};

var Downloader = function(options) {
	//INIT
	this.options = options;
	this.requires = [];
};

var _setRequires = function(libs) {
	libs = libs instanceof Array ? libs : [libs];
	for (var i = 0; i < libs.length; i++) {
		this.requires.push(requires(libs[i]));
	}
};

Downloader.prototype.onPacketReceived = function() {};
Downloader.prototype.onDownloadStart = function() {};
Downloader.prototype.onDownloadComplete = function() {};
Downloader.prototype.start = _startDownload;
Downloader.prototype.setRequires = _setRequires;

module.exports = Downloader;