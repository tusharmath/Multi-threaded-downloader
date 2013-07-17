var _ = require('underscore');
var functor = function() {};

var _CreateObject = function(lib, args) {

	functor.prototype = lib.prototype;
	var ob = new functor();
	lib.apply(ob, args);
	return ob;
};

var _CreateExecutor = function(lib) {
	var args = _.chain(arguments).toArray().rest().value();
	
	var obj = _CreateObject(lib, args);
	return lib.prototype.execute.bind(obj);
};

exports.executor = _CreateExecutor;

exports.ObjectCreator = _CreateObject;