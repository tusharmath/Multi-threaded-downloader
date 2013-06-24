var fs = require('fs');

var DownloadWriter = function(options) {
	var filePath = options.file;
	fs.open(filePath, 'a', undefined, function(err, fd) {
		this.fd = fd;
	});
};

var _write = function(data, position) {
	fs.write(this.fd, data, 0, data.length, position, this.callback);
};

DownloadWriter.prototype.execute = _write;
DownloadWriter.prototype.callback = function() {};

module.exports = DownloadWriter;