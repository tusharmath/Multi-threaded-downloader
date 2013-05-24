var ThreadRecordLoader = function(options) {
	options = options || {};
	this.requires = options.requires;
	this.path = options.path;
	this.readOptions = options.readOptions || {
		encoding: 'utf8'
	};
};

var _load = function() {
	var self = this;
	this.requires.fs.readFile(this.path, this.readOptions, function(data) {
		self.onLoad(JSON.parse(data));
	});
};

ThreadRecordLoader.prototype.load = _load;
ThreadRecordLoader.prototype.onLoad = function() {};

module.exports = ThreadRecordLoader;