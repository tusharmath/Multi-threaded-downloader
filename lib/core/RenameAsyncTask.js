var fs = require('fs');

var task = function(path) {
	this.oldPath = path;
	this.newPath = path.replace(/\.mtd$/, '');
};
task.prototype.execute = function() {
	fs.rename(this.oldPath, this.newPath, this.callback);
};

module.exports = task;