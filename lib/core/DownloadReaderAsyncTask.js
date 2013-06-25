//Read after the file size
var fs = require('fs');

var ThreadRecordReader = function(fd, fileSize) {
	this.fd = fd;
	this.downloadSize = fileSize;

};

var getFileSize = function(callback) {
	var self = this;
	fs.fstat(this.fd, function(err, stats) {
		if (err) this.onError(err);
		self.actualSize = stats.size;
		callback(stats.size);
	});
};

var read = function() {
	var position = this.downloadSize;
	var length = this.actualSize - this.downloadSize;
	var buffer = new Buffer(length);
	var self = this;
	fs.read(this.fd, buffer, 0, buffer.length, position, function(err, count, buffer) {
		if (err) console.error('DownloadReaderError:', err);
		self.callback(JSON.parse(buffer));
	});
};

var _execute = function() {
	var self = this;
	getFileSize.call(this, function(size) {
		read.call(self);
	});
};

var _remove = function() {
	this.requires.fs.unlink(this.path, this.onRemove);
};

ThreadRecordReader.prototype.execute = _execute;
ThreadRecordReader.prototype.onError = function(e) {
	console.error('FileReadTaskError:', e);
};
module.exports = ThreadRecordReader;