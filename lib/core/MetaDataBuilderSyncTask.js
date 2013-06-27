var block = 1024 * 10;

var getFileSize = function(callback) {

	var buffer = new Buffer(block);
	buffer.fill(' ');
	var dataString = JSON.stringify(this.data);
	buffer.write(dataString);
	//console.log(dataString, 'data-length:', dataString.length);
	//console.log('writing at', this.data.downloadSize, 'data-length', buffer.length, JSON.stringify(this.data).length);
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