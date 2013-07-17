var fs = require('fs');

var DownloadWriter = function(fd) {
	this.fd = fd;
};

var _write = function(data, position, callback) {

	this.callback = callback;
	var self = this;
	fs.write(this.fd, data, 0, data.length, position, function() {
		if (self.callback) self.callback(null, {
			dataLength: data.length,
			writePostion: position
		});
	});
};

DownloadWriter.prototype.execute = _write;
DownloadWriter.prototype.callback = function() {};

module.exports = DownloadWriter;