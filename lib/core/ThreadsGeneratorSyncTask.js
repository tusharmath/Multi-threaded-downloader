var _threadState = {};
_threadState.open = 0;
_threadState.closed = 1;
_threadState.failed = 2;

//TODO:Put it in a different module
var _setHeaderValues = function() {
	for (var i = 0; i < this.threads.length; i++) {
		var thread = this.threads[i];
		thread.header = 'bytes=' + thread.start + '-' + thread.end;
	}
};

var _initThreads = function() {

	var startRange = 0;
	var endRange = this.blockSize;
	var i = 0;
	var threads = this.threads;
	do {
		threads.push({
			position: startRange,
			start: startRange,
			end: endRange,
			connection: 'open'
		});
		i++;
		startRange = endRange + 1;
		endRange = this.blockSize * (i + 1);

	} while (i != this.count);

	threads[threads.length - 1].end += this.fileSize - threads[threads.length - 1].end;
};

var getBlockSize = function() {
	return Math.ceil(this.fileSize / this.count);
};

var ThreadsGenerator = function(options) {
	options = options || {};
	this.count = options.count || 32;
	_initThreads.call(this);
	_setHeaderValues.call(this);
};

ThreadsGenerator.prototype.states = _threadState;

module.exports = ThreadsGenerator;