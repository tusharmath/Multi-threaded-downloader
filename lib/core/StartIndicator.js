var StartIndicator = function(threads, fileSize, url, headers, cParams) {
	this.threads = threads;
	this.size = fileSize;
	this.url = url;
	this.headers = headers;
	this.cParams = cParams;
};

StartIndicator.prototype.execute = function(callback) {

	if (this.cParams.onStart) {
		this.cParams.onStart(this);
	}
	callback();
};

module.exports = StartIndicator;