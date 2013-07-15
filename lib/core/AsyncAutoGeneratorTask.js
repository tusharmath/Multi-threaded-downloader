var utils = require('../Utils');
var async = require('async');
var _ = require('underscore');

var AutoTasksGenerator = function(taskSetup, cParams) {
    this.taskSetup = taskSetup;
    this.cParams = cParams;
    this.tasks = {};

};


var _execute = function() {
    var self = this;
    self.tasks.cParams = function(callback, results) {
        callback(null, self.cParams);
    };
    _.each(self.taskSetup, function(task, name, taskList) {
        var lib = task.lib;

        self.tasks[name] = task.needs || [];
        self.tasks[name].push(function(callback, results) {

            var resultMap = function(item) {
                var keys = item.split('.');

                //TODO: Should use a loop
                if (keys.length == 1) return results[keys[0]];
                else if (keys.length == 2) return results[keys[0]][keys[1]];
            };


            var cParams, eParams;


            if (task.cParams) cParams = _.map(task.cParams, resultMap);
            //console.log(cParams);
            var ob = utils.ObjectCreator(lib, cParams);
            ob.callback = callback;
            if (task.eParams) eParams = _.map(task.eParams, resultMap);

            //console.log('calling:', name);
            //console.log('calling:', name, cParams);
            ob.execute.apply(ob, eParams);
            //ob.execute(eParams);

        });
    });


    var result = {
        tasks: this.tasks,
        type: 'auto'
    };

    async.auto(this.tasks, this.callback);


    //this.callback(null, result);
};

AutoTasksGenerator.prototype.execute = _execute;

module.exports = AutoTasksGenerator;