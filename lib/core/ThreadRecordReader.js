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

var _remove = function() {
	this.requires.fs.unlink(this.path, this.onRemove);
};

ThreadRecordReader.prototype.load = _load;
ThreadRecordReader.prototype.remove = _remove;
ThreadRecordReader.prototype.onLoad = function() {};
ThreadRecordReader.prototype.onRemove = function() {};

module.exports = ThreadRecordReader;