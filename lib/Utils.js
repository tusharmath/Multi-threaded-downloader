exports.ObjectCreator = function(lib, args) {
	var functor = function() {};
	functor.prototype = lib.prototype;
	var ob = new functor();
	lib.apply(ob, args);
	return ob;
};