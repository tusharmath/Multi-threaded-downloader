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
	this.threads = [];
	this.count = options.count || 1;
	this.fileSize = options.fileSize || 0;
	this.blockSize = getBlockSize.call(this) || 0;

	//Generate threads
	_initThreads.call(this);

};
module.exports = ThreadsGenerator;