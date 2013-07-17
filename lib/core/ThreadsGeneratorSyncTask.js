var ThreadsGenerator = function(fileSize, options) {
	options = options || {};
	this.fileSize = fileSize;
	this.count = options.count || 32;
	this.range = options.range || '0-100';
	
};

var rangeCalculator = function(fileSize, range, threadCount) {
	var s = range.split('-');
	var start = Math.ceil(s[0] * fileSize / 100);
	var end = Math.ceil(s[1] * fileSize / 100);
	var blockSize = Math.ceil((end - start) / threadCount);

	return {
		start: start,
		end: end,
		block: blockSize
	};
};

var _initThreads = function() {

	var startRange = this.range.start;
	var endRange = this.range.start + this.range.block;
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
		endRange = this.range.block * (i + 1);

	} while (i != this.count);

	threads[threads.length - 1].end += this.range.end - threads[threads.length - 1].end;
	return threads;
};


ThreadsGenerator.prototype.execute = function(callback) {
	this.callback = callback;
	this.range = rangeCalculator(this.fileSize, this.range, this.count);
	
	var threads = _initThreads.call(this);
	this.threads = threads;
	
	this.callback(null, threads);
};

module.exports = ThreadsGenerator;