var config = require('./ndOptions');
var fs = require('fs');

var _reCreateThreads = function(threads) {
	var oThreads = [];
	//var minBlockSize = 1000 * 10; //10 kb
	threads.forEach(function(t) {
		var diff = t.end - t.position;

		if (diff > 0) {
			oThreads.push({
				start: t.position,
				end: t.end,
				position: t.position,
				connection: 'open'
			});
		}
	});
	return oThreads;
};

var _getLogs = function() {
	var path = _options.logFile;

	if (fs.existsSync(path)) {

		var dataJSON = fs.readFileSync(path, {
			encoding: 'utf8'
		});
		console.log('Download logs found:', path);

		if (dataJSON.length !== 0) {
			var threads = JSON.parse(dataJSON);
			return _reCreateThreads(threads);
		}

	}
};

var _setLogs = function(threads) {
	if (config.create_download_log) {
		var path = _options.logFile;
		fs.writeFile(path, JSON.stringify(threads), {
			encoding: 'utf8'
		});
	}
};

var _deleteLogs = function() {
	if (fs.existsSync(_options.logFile)) {
		fs.unlink(_options.logFile);
	}

};

module.exports = function(options) {
	_options = options;
	return {
		load: _getLogs,
		save: _setLogs,
		remove: _deleteLogs
	};
};