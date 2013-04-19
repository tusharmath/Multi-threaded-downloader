//Requires
var fs = require("fs");

//Variables
var _fd;
var _options;


var fileWritten = function(err, written, buffer) {
	if (err) console.log("Error: " + err);
};

var _write = function(data, position) {
	fs.write(fd, data, 0, data.length, position, fileWritten);
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