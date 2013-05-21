var DownloadWriter = function(options) {
	var filePath = options.filePath || './download';
	this.requires = options.requires;

	this.requires.fs.open(filePath, 'a', undefined, function(err, fd) {
		this.fd = fd;
	});
};

var _write = function(data, position) {
	this.requires.fs.write(this.fd, data, 0, data.length, position, this.onWrite);
};

DownloadWriter.prototype.write = _write;
DownloadWriter.prototype.onWrite = function() {};

module.exports = DownloadWriter;