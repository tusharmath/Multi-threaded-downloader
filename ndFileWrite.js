//Requires
var fs = require("fs");

//Variables
var _fd;
var _options;
var _writeStream;



var _write = function(data, position, callback) {
	//console.log("Writing at:", position);
	callback(fs.writeSync(_fd, data, 0, data.length, position));
};

var setfd = function(err, fd) {
	_fd = fd;
};

module.exports = function(options) {
	_options = options;
	fs.open(_options.path, 'a', undefined, setfd);

	return {
		write: _write
	};
};