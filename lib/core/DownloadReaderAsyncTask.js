//Read after the file size
var fs = require('fs');
var e = require('../Exceptions');



var DownloadReaderTask = function(fd, options) {
	this.fd = fd;
	this.block = options.block || 1024 * 10;
	//console.log(this.block);
};

var getFileSize = function(callback) {
	var self = this;
	//console.log('handle:', this.fd);
	fs.fstat(this.fd, function(err, stats) {
		if (err) this.onError(err);

		self.actualSize = stats.size;
		//console.log('file size on disk:', self.actualSize, ' real be', self.actualSize - self.block);
		callback(null, stats.size);
	});
};

var read = function() {

	var position = this.actualSize - this.block;
	var length = this.block;
	//console.log('Reading:', position, length);
	var buffer = new Buffer(length);
	var self = this;
	fs.read(this.fd, buffer, 0, buffer.length, position, function(err, count, buffer) {
		if (err) self.onError(err);

		//console.log('Bytes read:', count);
		//console.log('meta:', meta);
		var meta = buffer.toString();
		//console.log(meta, meta.length);
		var data = JSON.parse(meta);
		self.callback(null, data);
		//console.log('data:', data);
		//self.onStart(data);
	});
};

var _execute = function() {
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