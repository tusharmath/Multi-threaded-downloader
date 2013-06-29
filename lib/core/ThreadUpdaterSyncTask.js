var task = function(threads) {
	this.threads = threads;
};

var _execute = function(index, data) {
	var thread = threads[index];
	thread.position += data.length;
	if (thread.position === thread.end) {
		thread.connection = 'closed';
	}
	this.callback(null, threads);
};

task.prototype.execute = _execute;

module.exports = task;