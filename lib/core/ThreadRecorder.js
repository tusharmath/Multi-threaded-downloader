var _onError = function(err) {
	if (err) console.error('Thread Record error:', err);
};

var ThreadRecorder = function(options) {

	this.threads = options.threads;
	this.requires = options.requires;

	this.fileName = options.fileName || '_' + new Date().valueOf();
	this.filePath = options.filePath || this.requires.os.tmpdir();
	this.fullPath = this.filePath + '/' + this.fileName;
	var self = this;
	this.requires.fs.open(this.fullPath, 'a', undefined, function(err, fd) {
		_onError(err);
		self.fileDescriptor = fd;
	});
};

var _onChunkSaved = function(err, written, buffer) {
	_onError(err);
};

var _save = function(data, position) {
	this.requires.fs.write(this.fileDescriptor, data, 0, data.length, position, _onChunkSaved);
};

ThreadRecorder.prototype.save = _save;

module.exports = ThreadRecorder;