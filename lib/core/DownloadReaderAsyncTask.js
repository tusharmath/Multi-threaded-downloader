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
		self.actualSize = stats.size;
		callback(err, stats.size);
	});
};

var read = function(callback) {

	var position = this.actualSize - this.block;
	var length = this.block;

	var buffer = new Buffer(length);
	var self = this;
	fs.read(this.fd, buffer, 0, buffer.length, position, function(err, count, buffer) {
		var meta = buffer.toString();

		try {
			var data = JSON.parse(meta);
			callback(err, data);
		} catch (exp) {
			callback(e(1012));
		}

	});
};

var _execute = function(callback) {
	var self = this;
	getFileSize.call(this, function(err, size) {
		if (err) {
			callback(err);
		} else {
			read.call(self, callback);
		}

	});
};

DownloadReaderTask.prototype.execute = _execute;
module.exports = DownloadReaderTask;