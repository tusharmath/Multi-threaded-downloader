var fs = require('fs');

var _reCreateThreads = function(threads) {
	var oThreads = [];
	var minblockSize = 1000 * 10; //10 kb
	threads.forEach(function(t) {
		var diff = t.end - t.position;

		if (diff > minblockSize) {
			oThreads.push({
				start: t.position,
				end: t.end,
				position: t.position
			});
		} else if (diff > 0) {
			oThreads.push({
				start: t.position - minBlockSize,
				end: t.end,
				position: t.position - minBlockSize
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
		var threads = JSON.parse(dataJSON);
		return _reCreateThreads(threads);
	}
};

var _setLogs = function(threads) {
	var path = _options.logFile;
	fs.writeFile(path, JSON.stringify(threads), {
		encoding: 'utf8'
	});
};

var _deleteLogs = function() {
	fs.unlink(_options.logFile);
};

module.exports = function(options) {
	_options = options;
	return {
		getLogs: _getLogs,
		setLogs: _setLogs,
		deleteLogs: _deleteLogs
	};
};