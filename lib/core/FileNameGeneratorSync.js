var FileNameGenerator = function(fileName) {
	this.file = fileName;
};

FileNameGenerator.prototype.execute = function(callback) {
	this.callback = callback;
	var file = this.file;
	var result;
	if (file.match(/\.mtd$/)) {
		result = {
			downloadFile: file,
			originalFile: file.replace(/\.mtd$/, '')
		};
	} else {
		result = {
			downloadFile: file + '.mtd',
			originalFile: file
		};

	}
	this.callback(null, result);
};

module.exports = FileNameGenerator;