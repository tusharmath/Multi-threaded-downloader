//UNIVERSALS
var a = require('async');
var e = require('./Exceptions');
var u = require('./Utils');
var NewDownload = require('./NewDownloadSetup');
var ReDownload = require('./ReDownloadSetup');

var isReDownload = function() {
	this.cParams.downloadType = 'new';
	if (this.cParams.file.match(/.*\.mtd$/g)) {
		this.cParams.downloadType = 're';
		return true;
	}
	return false;
};

var TaskExecuter = function(file, url, cParams) {
	this.cParams = cParams || {};

	this.cParams.file = file;

	if (isReDownload.call(this) === false) {
		this.cParams.url = url;
	}
};


var _start = function() {

	var self = this;
	var callback = function(tasks) {
		a.auto(tasks, self.cParams.onEnd);
	};

	if (self.cParams.downloadType == 'new') {
		if (self.cParams.url === undefined) self.cParams.onEnd(e(1005));
		else u.executor(NewDownload, self.cParams)(callback);
	} else {
		u.executor(ReDownload, self.cParams)(callback);
	}
};


TaskExecuter.prototype.start = _start;

module.exports = TaskExecuter;