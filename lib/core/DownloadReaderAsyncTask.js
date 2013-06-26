//Read after the file size
var fs = require('fs');
var JSON5 = require('json5');

var block = 1024;

var ThreadRecordReader = function(fd) {
	this.fd = fd;
	//this.downloadSize = fileSize;
};

var getFileSize = function(callback) {
	var self = this;
	console.log('handle:', this.fd);
	fs.fstat(this.fd, function(err, stats) {
		if (err) this.onError(err);
		self.actualSize = stats.size;
		callback(stats.size);
	});
};

var read = function() {
	var position = this.actualSize - block;
	var length = block;
	//console.log('Reading:', position , length);
	var buffer = new Buffer(length);
	var self = this;
	fs.read(this.fd, buffer, 0, buffer.length, position, function(err, count, buffer) {
		if (err) console.error('DownloadReaderError:', err);
		var meta = buffer.toString();
		//console.log(meta, meta.length);
		self.callback(JSON5.parse(meta));
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