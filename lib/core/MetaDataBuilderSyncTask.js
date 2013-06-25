var task = function(file, options) {
	this.file = file;
	this.data = options;
};

task.prototype.execute = function() {
	var file = this.file;
	if (!file.match(/\.mtd$/)) {
		file = file + '.mtd';
	}
	this.callback({
		data: JSON.stringify(this.data),
		file: file
	});
};

module.exports = task;