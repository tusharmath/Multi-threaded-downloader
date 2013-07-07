var _ = require('underscore');
var async = require('async');
var utils = require('./Utils');

var WaterfallTask = function(taskSetup, cParams) {
	this.taskSetup = taskSetup;
	this.cParams = cParams;
	this.tasks = [];
};

var _getParams = function(obj, keys) {
	//console.log(obj, keys);
	return _.chain(obj).pick(keys).values().value();
};

var _execute = function() {
	var self = this;
	this.tasks.push(function(callback) {
		callback(null, self.cParams);
	});
	_.each(this.taskSetup, function(task, name, tasks) {
		self.tasks.push(function(result, callback) {
			//console.log('calling', name);
			var cParams = _getParams(result, task.cParams);
			var eParams = _getParams(result, task.eParams);
			//console.log(name, cParams, eParams);
			var obj = utils.ObjectCreator(task.lib, cParams);
			obj.callback = callback;
			obj.execute.apply(obj, eParams);
		});
	});

	//console.log(this.tasks);
	var result = {
		tasks: this.tasks,
		type: 'waterfall'
	};
	this.callback(null, result);
};

WaterfallTask.prototype.execute = _execute;
module.exports = WaterfallTask;