var fs = require('fs');

var DownloadWriter = function(fd) {
	this.fd = fd;
};

var _write = function(data, position) {
	//console.log('Writer:', writeData);
	//var data = writeData.data;
	//var position = writeData.position;
	var self = this;
	//console.log('writing at:', writeData.position);
	fs.write(this.fd, data, 0, data.length, position, function() {
		self.callback(null, {
			dataLength: data.length,
			writePostion: position
		});
	});
};

DownloadWriter.prototype.execute = _write;
DownloadWriter.prototype.callback = function() {};

module.exports = DownloadWriter;