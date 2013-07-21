var _ = require('underscore');
var e = require('../Exceptions');

var DownloadTimeoutTask = function(threads, options) {
	this.threads = threads;

	//Optional
	options = options || {};
	this.timeout = options.timeout || 5; // 10 Seconds timeout

	//Defaults
	this.totalBytesDownloaded = 0;
};

var start = function() {
	var self = this;
	this.timer = setInterval(function() {

		var bytesDownloaded = _.reduce(self.threads, function(result, thread) {
			return result + thread.position - thread.start;
		}, 0);

		if (bytesDownloaded > self.totalBytesDownloaded) {
			// All is well
			self.totalBytesDownloaded = bytesDownloaded;
		} else {
			self.stop();
			self.callback(e(1001, self.timeout));
		}
	}, this.timeout * 1000);

};

var _execute = function(cmd, callback) {
	this.callback = callback;
	if (cmd == 'start') start.call(this);
	else if (cmd == 'stop') this.stop.call(this);
};

DownloadTimeoutTask.prototype.execute = _execute;
DownloadTimeoutTask.prototype.stop = function() {
	clearInterval(this.timer);
};

module.exports = DownloadTimeoutTask;