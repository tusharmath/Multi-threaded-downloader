var getFileSize = function(callback) {
	var buffer = new Buffer(JSON.stringify(this.data));
	console.log('writing at', this.data.downloadSize, 'data-length', buffer.length);
	this.callback({
		data: buffer,
		position: this.data.downloadSize
	});
};

var task = function(threads, url, fileSize, fd) {
	this.data = {
		threads: threads,
		url: url,
		downloadSize: fileSize
	};
	this.fd = fd;
};

task.prototype.execute = function() {
	getFileSize.call(this, this.callback);
};

module.exports = task;