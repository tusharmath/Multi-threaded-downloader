var _onError = function(err) {
	if (err) console.error('Thread Record error:', err);
};

var ThreadRecorder = function(options) {
	this.requires = options.requires;
	this.threads = options.threads;

	this.fileName = (options.fileName || '_' + new Date().valueOf()) + '.mtd.json';
	this.filePath = options.filePath || this.requires.os.tmpdir();
	this.fullPath = this.filePath + '/' + this.fileName;
};

var _onChunkSaved = function(err, written, buffer) {
	_onError(err);
};

var _save = function() {
	this.requires.fs.writeFile(this.fullPath, JSON.stringify(this.threads), {
		encoding: 'utf8'
	});
};

ThreadRecorder.prototype.save = _save;

module.exports = ThreadRecorder;