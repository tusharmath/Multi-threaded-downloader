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
	var endRange = this.range.block;
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


var ThreadsGenerator = function(fileSize, options) {
	this.fileSize = fileSize;

	options = options || {};
	this.count = options.count || 32;

	//TODO:Implement
	this.range = options.range || '0-100';
};

ThreadsGenerator.prototype.execute = function() {
	this.range = rangeCalculator(this.fileSize, this.range, this.count);
	//console.log('range', this.range);
	var threads = _initThreads.call(this);
	this.threads = threads;
	if (this.callback) this.callback(threads);

};

module.exports = ThreadsGenerator;