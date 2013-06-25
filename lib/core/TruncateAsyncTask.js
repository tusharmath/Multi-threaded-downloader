var fs = require('fs');

var task = function(fd, fileSize) {
	this.fd = fd;
	this.fileSize = fileSize;
};
var _execute = function() {
	fs.ftruncate(this.fd, this.fileSize, callback);
};


task.prototype.execute = _execute;

module.exports = task;