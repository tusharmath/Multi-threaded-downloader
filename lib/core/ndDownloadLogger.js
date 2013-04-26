var fs = require('fs');

var _getLogs = function() {
	var path = _options.logFile;

	if (fs.existsSync(path)) {

		var dataJSON = fs.readFileSync(path, {
			encoding: 'utf8'
		});
		console.log('Download logs found:', path);
		var log = JSON.parse(dataJSON);

		return log;
	}
};

var _setLogs = function() {
	var path = _options.logFile;
	fs.writeFile(path, JSON.stringify(_threads), {
		encoding: 'utf8'
	});
};

var _deleteLogs = function() {
	fs.unlink(_options.logFile);
};

modules.export = function(options) {
	_options = options;
	return {
		getLogs: _getLogs,
		setLogs: _setLogs,
		deleteLogs: _deleteLogs
	};
};