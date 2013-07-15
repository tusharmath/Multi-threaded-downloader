var fs = require('fs');

var task = function(oldName, newName) {
	this.oldPath = oldName;
	this.newPath = newName;
};
task.prototype.execute = function() {
	fs.rename(this.oldPath, this.newPath, this.callback);
};

module.exports = task;