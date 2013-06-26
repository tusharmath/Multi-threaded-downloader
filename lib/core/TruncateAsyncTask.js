var fs = require('fs');

var task = function(fd, fileSize) {
	this.fd = fd;
	this.fileSize = fileSize;
};
var _execute = function() {
	//console.log('truncating:', this);
	fs.ftruncate(this.fd, this.fileSize, this.callback);
	//this.callback();
};


task.prototype.execute = _execute;

module.exports = task;