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

var _create = function(options) {
	//console.log('destory:', this.destory);
	if (this.destory === true || this.destory === undefined) {

		this.threads = [];
		this.count = options.count || 1;
		this.fileSize = options.fileSize || 0;
		this.blockSize = getBlockSize.call(this) || 0;

		_initThreads.call(this);
		_setHeaderValues.call(this);

		this.count = this.threads.length;
		this.destroy = false;
	}
};

exports.create = _create;