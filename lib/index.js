var ThreadRecordReader = require('./core/ThreadRecordReader');
var DownloadFileNameGenerator = require('./core/DownloadFileNameGenerator');
var HeadDownloader = require('./core/HeadDownloader');
var ThreadsGenerator = require('./core/ThreadsGenerator');
var Analytics = require('./core/Analytics');
var ThreadRecordWriter = require('./core/ThreadRecordWriter');
var DownloadWriter = require('./core/DownloadWriter');
var Checksum = require('./core/Checksum');
var BodyDownloader = require('./core/BodyDownloader');

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