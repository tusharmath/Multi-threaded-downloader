var ThreadRecordWriter = function(options) {
	this.requires = options.requires;
	this.threads = options.threads;

	this.fileName = (options.fileName || '_' + new Date().valueOf()) + '.mtd.json';
	this.filePath = options.filePath || this.requires.os.tmpdir();
	this.fullPath = this.filePath + '/' + this.fileName;
};

var _save = function() {
	this.requires.fs.writeFile(this.fullPath, JSON.stringify(this.threads), {
		encoding: 'utf8'
	});
};

ThreadRecordWriter.prototype.save = _save;

module.exports = ThreadRecordWriter;