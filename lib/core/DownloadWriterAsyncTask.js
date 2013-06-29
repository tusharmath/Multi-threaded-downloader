var fs = require('fs');

var DownloadWriter = function(fd, options) {
	this.fd = fd;
};

var _write = function(writeData) {
	//console.log('Writer:', writeData);
	var data = writeData.data;
	var position = writeData.position;
	var self = this;
	//console.log('data:', data);
	fs.write(this.fd, data, 0, data.length, position, function() {
		self.callback(null, data.length);
	});
};

DownloadWriter.prototype.execute = _write;
DownloadWriter.prototype.callback = function() {};

module.exports = DownloadWriter;