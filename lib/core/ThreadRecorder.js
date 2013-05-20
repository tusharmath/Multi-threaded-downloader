var ThreadRecorder = function(options) {

	this.threads = options.threads;
	this.requires = options.requires;

	this.fileName = options.fileName || '_' + new Date().valueOf();
	this.filePath = options.filePath || this.requires.os.tmpdir();

};


var _save = function() {

};

ThreadRecorder.prototype.save = _save;

module.exports = ThreadRecorder;