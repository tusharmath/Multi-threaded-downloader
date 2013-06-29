var fs = require('fs');

var task = function(fileNameGenerator) {
	this.oldPath = fileNameGenerator.downloadFile;
	this.newPath = fileNameGenerator.originalFile;
};
task.prototype.execute = function() {
	fs.rename(this.oldPath, this.newPath, this.callback);
};

module.exports = task;