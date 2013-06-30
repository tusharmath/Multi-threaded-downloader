var task = function(commonOptions) {
	this.file = commonOptions.file;
};

task.prototype.execute = function() {
	var file = this.file;
	if (file.match(/\.mtd$/)) {
		this.downloadFile = file;
		this.originalFile = file.replace(/\.mtd$/, '');

	} else {
		this.downloadFile = file + '.mtd';
		this.originalFile = file;
	}
	this.callback(null, this);
};

module.exports = task;