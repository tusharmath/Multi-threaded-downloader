var config = require('./ndOptions');
var _logInline = function(str) {
	process.stdout.clearLine(); // clear current text
	process.stdout.cursorTo(0); // move cursor to beginning of line
	process.stdout.write(str.toString()); // write text
};

var loadLogs = function(status) {
	var log = [];
	config.console_log_info.forEach(function(i) {
		if (status[i] instanceof Array) {
			log.push(i + ': ' + status[i].join(' '));
		} else {
			log.push(i + ': ' + status[i]);
		}

	});
	return log.join(' ');
};

exports.logAnalytics = function(status) {
	//console.log(status);

	_logInline(loadLogs(status));
	//	console.log(threads.getStatus());

};