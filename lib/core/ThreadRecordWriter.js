var ThreadRecordWriter = function(options) {
	options = options || {};
	this.threads = options.threads || {};

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
ThreadRecordWriter.prototype.using = 'fs os';
module.exports = ThreadRecordWriter;