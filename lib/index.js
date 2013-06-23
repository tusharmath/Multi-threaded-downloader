var mtd = function(options) {
	//Required
	this.url = options.url;
	this.filePath = options.filePath;

	//Optional
	this.count = options.count || 32;

};

var _download = function() {

};
mtd.prototype.download = _download;
module.exports = mtd;