var _ = require('underscore');

var Task = function(threads, options) {
	this.threads = threads;

	//Optional
	options = options || {};
	this.timeout = options.timeout || 5000;

	//Defaults
	this.totalBytesDownloaded = 0;

	//this.downloadSize = _.last(threads).end - _.first(threads).start;
};

var _execute = function() {
	var self = this;

	this.timer = setInterval(function() {
		//console.log('threads:', self.threads);
		var bytesDownloaded = _.reduce(self.threads, function(result, thread) {
			return result + thread.position - thread.start;
		}, 0);
		//console.log(bytesDownloaded, self.totalBytesDownloaded);
		if (bytesDownloaded > self.totalBytesDownloaded) {
			// All is well
			self.totalBytesDownloaded = bytesDownloaded;
		} else {
			//Incomplete Download
			clearInterval(self.timer);
			self.callback(null, this);
		}
	}, this.timeout);
};

Task.prototype.execute = _execute;
Task.prototype.stop = function() {
	clearInterval(this.timer);
};

module.exports = Task;