//Read after the file size
var fs = require('fs');
var e = require('../Exceptions');



var DownloadReaderTask = function(fd, options) {
	this.fd = fd;
	this.block = options.block || 1024 * 10;
	
};

var getFileSize = function(callback) {
	var self = this;
	
	fs.fstat(this.fd, function(err, stats) {
		if (err) this.onError(err);

		self.actualSize = stats.size;
		
		callback(null, stats.size);
	});
};

var read = function() {

	var position = this.actualSize - this.block;
	var length = this.block;
	
	var buffer = new Buffer(length);
	var self = this;
	fs.read(this.fd, buffer, 0, buffer.length, position, function(err, count, buffer) {
		if (err) self.onError(err);

		
		
		var meta = buffer.toString();
		
		var data = JSON.parse(meta);
		self.callback(null, data);
		
		//self.onStart(data);
	});
};

var _execute = function(callback) {
	this.callback = callback;
	var self = this;
	getFileSize.call(this, function(size) {
		read.call(self);
	});


};

DownloadReaderTask.prototype.execute = _execute;
DownloadReaderTask.prototype.onError = function(e) {
	console.error('FileReadTaskError:', e);
};
module.exports = DownloadReaderTask;