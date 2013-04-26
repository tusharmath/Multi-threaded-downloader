var fs = require('fs');

module.exports = function(path) {
	path = path || './config.json';
	var json = fs.fileReadSync(path);
	return JSON.parse(json);
};