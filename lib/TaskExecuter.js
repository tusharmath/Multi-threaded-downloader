var async = require('async');
var HeadRequest = require('./core/HeadRequestAsyncTask');

var setupTasks = function() {
	var self = this;
	this.tasks = {};
	this.tasks['head-request'] = function(callback) {

		var req = new HeadRequest(self.url);
		req.callback = callback;
		req.execute();
	};

};

var executer = function(file, url, options) {
	this.file = file;
	this.url = url;
	setupTasks.call(this);
};

var _start = function() {
	async.auto(this.tasks, this.callback);
};

executer.prototype.start = _start;
executer.prototype.callback = function(a, b) {
	console.log('Result:', a);
};

module.exports = executer;



/*
	## New Download
	Head request (get file size etc.)
		Create Threads
			Create MetaData
				File Handler
					Write MetaDAta
						Read MetaData
							Create Threads
								Body Download
									Write Data
									Write Meta Data
	
	## Reading Download File
	File Handler
		Read MetaData
			Body Download
				Write MetaDAta
				Write Data
	
*/