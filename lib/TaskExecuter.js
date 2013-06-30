//REQUIRES
var async = require('async');
var _ = require('underscore');
var http = require('http');
var TaskSetup = require('./TaskSetup');

http.globalAgent.maxSockets = 200;
http.Agent.defaultMaxSockets = 200;

// Initialize and execute tasks

var smartBoy = function(lib, args) {
	var ob = {};
	ob.__proto__ = lib.prototype;
	lib.apply(ob, args);
	return ob;
};

var initTasks = function() {
	var self = this;
	self.asyncTasks = {
		'common-options': function(callback, results) {
			callback(null, self.options);
		}
	};
	// /console.log(self);
	_.each(self.taskSetup.tasks, function(task, name, taskList) {
		//console.log(typeof task.lib, name);
		var lib = task.lib;

		self.asyncTasks[name] = task.needs || [];
		self.asyncTasks[name].push(function(callback, results) {

			var resultMap = function(item) {
				return results[item];
			};


			var ob = {};
			ob.__proto__ = lib.prototype;

			var cParams, eParams;


			if (task.cParams) cParams = _.map(task.cParams, resultMap);
			//console.log(cParams);
			lib.apply(ob, cParams);
			ob.callback = callback;
			if (task.eParams) eParams = _.map(task.eParams, resultMap);

			//console.log('calling:', name);
			//console.log('calling:', name, cParams);
			ob.execute.apply(ob, eParams);
			//ob.execute(eParams);

		});
	});
};

var TaskExecuter = function(file, url, options) {
	options = options || {};
	options.file = file;
	options.url = url;
	this.options = options;
	if (options.file.match(/\.mtd$/)) {
		this.taskSetup = new TaskSetup('re', options);
	} else {
		this.taskSetup = new TaskSetup('new', options);
	}
};

var _start = function() {

	initTasks.call(this);
	//console.log(this.asyncTasks);

	async.auto(this.asyncTasks, this.callback);
};

TaskExecuter.prototype.start = _start;
TaskExecuter.prototype.callback = function(err, results) {

	//TODO: Remove
	console.log('\n---Results\n', results);
};

module.exports = TaskExecuter;