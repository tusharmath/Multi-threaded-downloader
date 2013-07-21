var _ = require('underscore');

var ThreadsDestroyer = function(threads) {
	this.threads = threads;
};


ThreadsDestroyer.prototype.execute = function(callback) {
	_.each(this.threads, function(item) {
		item.connection = 'failed';
		if (item.destroy) item.destroy();
	});
	if (callback) callback();
};

module.exports = ThreadsDestroyer;