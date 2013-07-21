var StartIndicator = function(threads, fileSize, url, cParams) {
	this.threads = threads;
	this.size = fileSize;
	this.url = url;
	this.cParams = cParams;
};

StartIndicator.prototype.execute = function(callback) {

	if (this.cParams.onStart) {
		this.cParams.onStart(this);
	}
	callback();
};

module.exports = StartIndicator;