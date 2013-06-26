//Read after the file size
var fs = require('fs');
var JSON5 = require('json5');

var ThreadRecordReader = function(fd, fileSize) {
	this.fd = fd;
	this.downloadSize = fileSize;
};

var read = function() {
	var position = this.downloadSize;
	var length = 1024;
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

	read.call(self);

};

var _remove = function() {
	this.requires.fs.unlink(this.path, this.onRemove);
};

ThreadRecordReader.prototype.execute = _execute;
ThreadRecordReader.prototype.onError = function(e) {
	console.error('FileReadTaskError:', e);
};
module.exports = ThreadRecordReader;