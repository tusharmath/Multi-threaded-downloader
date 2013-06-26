var fs = require('fs');

var DownloadWriter = function(fd, options) {
	this.fd = fd;
};

var _write = function(args) {
	var data = args.data;
	var position = args.position;
	var self = this;
	fs.write(this.fd, data, 0, data.length, position, function() {
		self.callback(data.length);
	});
};

DownloadWriter.prototype.execute = _write;
DownloadWriter.prototype.callback = function() {};

module.exports = DownloadWriter;