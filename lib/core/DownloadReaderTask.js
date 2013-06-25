//Read after the file size
var fs = require('fs');

var ThreadRecordReader = function(file, fileSize) {
	this.file = file;
	this.downloadSize = fileSize;

};

var getFileSize = function(callback) {
	fs.stat(this.file, function(err, stats) {
		if (err) this.onError(err);
		this.size = stats.size;
		callback(stats.size);
	});
};
var parseDownloadInfo = function(data) {
	this.callback(JSON.parse(data));
};

var read = function() {
	var buffer = [];
	var position = this.downloadSize + 1;
	var length = this.size - this.downloadSize;
	fs.read(this.fd, buffer, 0, length, position, parseDownloadInfo);
};

var _execute = function() {
	var self = this;
	getFileSize.call(this, function(size) {
		fs.open(self.file, 'r', function(err, fd) {
			if (err) self.onError(err);
			self.fd = fd;
			read.call(self);
		});
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