//Requires
var fs = require("fs");

//Variables
var _fd;
var _options;
var _writeStream;



var _write = function(data, position, callback) {
	_writeStream.write(data, undefined, function() {
		callback(data.length);
	});

	/*
	var buff = new Buffer(data, 'binary');
	console.log("fs", fs);
	fs.write(_fd, buff, 0, buff.length, position, callback);
	*/
};

var setfd = function(err, fd) {
	_fd = fd;
};

module.exports = function(options) {
	_options = options;
	_writeStream = fs.createWriteStream(options.path, {
		encoding: 'binary'
	});

	//	fs.open(_options.path, 'a', undefined, setfd);

	return {
		write: _write
	};
};