var _initThreads = function() {

	var startRange = 0;
	var endRange = this.blockSize;
	var i = 0;
	var threads = [];
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
	return threads;
};

var getBlockSize = function() {
	return Math.ceil(this.fileSize / this.count);
};

var ThreadsGenerator = function(fileSize, options) {
	this.fileSize = fileSize;

	options = options || {};
	this.count = options.count || 32;
};

ThreadsGenerator.prototype.execute = function() {
	this.blockSize = getBlockSize.call(this);
	var threads = _initThreads.call(this);
	this.callback(threads);

};

module.exports = ThreadsGenerator;