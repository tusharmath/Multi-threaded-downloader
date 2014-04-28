var _ = require('underscore');

var ThreadsDestroyer = function(threads) {
	this.threads = threads;
};


ThreadsDestroyer.prototype.execute = function(callback) {
	_.each(this.threads, function(item) {

		var wasComplete = item.connection == 'failed' || item.connection == 'closed' ? true : false;

		if (wasComplete === false && item.destroy) {

			item.destroy();
		}
	});
	if (callback) callback();
};

module.exports = ThreadsDestroyer;