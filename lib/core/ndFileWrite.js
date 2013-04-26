//Requires
var config = require('./ndOptions');
var fs = require("fs");

//Variables
var _fd;
var _options;
var _writeStream;


var _updateLogger = function(start, end) {
	var r = fileWriteStatus[start - 1];
	if (r === undefined) {
		fileWriteStatus[end] = end - start;
	} else {
		var t = r + end - start;
		delete fileWriteStatus[start - 1];
		fileWriteStatus[end] = t;
	}
};

_complete = function() {
	console.log(fileWriteStatus);
};

var _write = function(data, position, callback) {
	//console.log("Writing at:", position);	
	if (config.create_download_log) {
		_updateLogger(position, position + data.length);
	}
	fs.write(_fd, data, 0, data.length, position, callback);

};

var setfd = function(err, fd) {
	_fd = fd;
};

module.exports = function(options) {
	_options = options;
	fs.open(_options.path, 'a', undefined, setfd);

	fileWriteStatus = [{
		start: 0,
		end: _options.fileSize
	}];
	return {
		write: _write,
		complete: _complete
	};
};