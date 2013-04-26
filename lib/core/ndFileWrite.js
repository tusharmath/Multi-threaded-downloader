//Requires
var config = require('./ndOptions');
var fs = require("fs");


var _onChunkSaved = function(err, written, buffer) {
	if (err) console.log("ERROR:", err);
};

var _write = function(data, position) {
	//console.log("Writing at:", position);
	fs.write(_fd, data, 0, data.length, position, _onChunkSaved);
};

var setfd = function(err, fd) {
	if (err) console.log('Error:', err);
	_fd = fd;
	console.log('File created:', path);
};

module.exports = function(filename) {
	path = config.download_path + filename;
	fs.open(path, 'a', undefined, setfd);
	return {
		write: _write
	};
};