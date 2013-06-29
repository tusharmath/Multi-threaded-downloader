var fs = require('fs');

var task = function(fileNameGenerator) {
	//console.log(fileNameGenerator)
	this.file = fileNameGenerator.downloadFile;
};

var _execute = function() {
	var self = this;
	fs.open(this.file, 'a+', undefined, function(err, fd) {
		if (err) self.onError(err);
		self.fd = fd;
		self.callback(null, fd);
	});
};

task.prototype.execute = _execute;
task.prototype.onError = function(err) {
	console.error('FileHandlerError', err);
};

module.exports = task;