var _ = require('underscore');
var e = require('../Exceptions');
var DownloadValidator = function(threads) {
	this.threads = threads;
};

DownloadValidator.prototype.execute = function(callback) {
	var isCompleted = _.some(this.threads, function(item) {
		return item.position >= item.end;
	});
	if (isCompleted === true) callback(null, true);
	else callback(e(1013));

};

module.exports = DownloadValidator;