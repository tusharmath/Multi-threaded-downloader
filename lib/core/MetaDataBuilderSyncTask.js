var MetaDataBuilder = function(threads, fileSize, url, method, port, options) {
	this.data = {
		threads: threads,
		url: url,
		method: method,
		port: port,
		downloadSize: fileSize
	};
	this.block = options.block || 1024 * 10;
};


MetaDataBuilder.prototype.execute = function() {
	var buffer = new Buffer(this.block);
	buffer.fill(' ');

	var dataString = JSON.stringify(this.data);
	buffer.write(dataString);
	//console.log(this.data.threads[0].position);
	// console.log('data-length:', dataString.length, buffer.length);
	//console.log('writing at', this.data.downloadSize, 'data-length', buffer.length);
	var result = {
		data: buffer,
		position: this.data.downloadSize
	};
	//console.log('metadata:', result);
	this.callback(null, result);
};

module.exports = MetaDataBuilder;