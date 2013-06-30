var fs = require('fs');

var task = function(fd, metaData) {
	this.fd = fd;
	this.fileSize = metaData.downloadSize;
};
var _execute = function() {
	//console.log('truncating:', this);
	fs.ftruncate(this.fd, this.fileSize, this.callback);
	//this.callback();
};


task.prototype.execute = _execute;

module.exports = task;