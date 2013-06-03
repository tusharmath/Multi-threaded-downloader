var async = require('async');
var factory = require('./utils/Factory');

/*
Steps 
1. Make head request
2. 

*/

var _tasks = {};
_tasks.HeadRequest = function(options) {


};


var Mtd = function() {

};

var _start = function() {};
var _stop = function() {};

Mtd.prototype.start = _start;
Mtd.prototype.stop = _stop;
Mtd.prototype.tasks = _tasks;
Mtd.prototype.onHead = function() {};
Mtd.prototype.onBody = function() {};


module.exports = Mtd;