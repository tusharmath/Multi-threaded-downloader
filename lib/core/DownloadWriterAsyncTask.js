var e = require('../Exceptions');
var fs = require('fs');

var DownloadWriter = function(fd) {
	this.fd = fd;
};

var _write = function(data, position, callback) {

	this.callback = callback;
	var self = this;
	fs.write(this.fd, data, 0, data.length, position, function(err) {
		if (err) {
			self.callback(e(1011));
		} else if (self.callback) self.callback(null, {
			dataLength: data.length,
			writePostion: position
		});
	});
};

DownloadWriter.prototype.execute = _write;

module.exports = DownloadWriter;