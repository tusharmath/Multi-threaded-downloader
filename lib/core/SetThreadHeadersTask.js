var task = function(threads) {
	this.threads = threads;
	//console.log('taskSetup-threads', threads);
};

var _execute = function() {
	for (var i = 0; i < this.threads.length; i++) {
		var thread = this.threads[i];
		thread.header = 'bytes=' + thread.start + '-' + thread.end;
	}
	this.callback(null, this.threads);
};

task.prototype.execute = _execute;

module.exports = task;