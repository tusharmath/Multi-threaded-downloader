var ThreadRecordReader = function(options) {
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

ThreadRecordReader.prototype.load = _load;
ThreadRecordReader.prototype.onLoad = function() {};

module.exports = ThreadRecordReader;