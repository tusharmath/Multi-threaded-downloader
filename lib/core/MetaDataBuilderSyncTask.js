var task = function(file, threads, url) {
	this.file = file;
	this.data = {
		file: file,
		threads: threads,
		url: url
	};
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