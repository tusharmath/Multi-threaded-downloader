var config = require("./ndOptions");
var ndConsoleLogger = require('./ndConsoleLogger');

var _getStatus_threads = function(threads) {
	var positions = [];
	var active = 0;
	var dataReceived = 0;
	var fileSize = 0;
	var i = 0;

	while (i < threads.count()) {

		//THREAD POSITIONS
		var t = threads.getStatus(i++);
		var val = Math.floor((t.position - t.start) * 10000 / (t.end - t.start)) / 100;
		val = val.toString();
		positions.push(val);

		//ACTIVE THREADS
		if (t.start != t.position && t.end != t.position) {
			active++;
		}

		//FILE SIZE
		fileSize += (t.end - t.start + 1);

		//DATA RECIEVED
		dataReceived += (t.position - t.start);

	}


	return {
		positions: positions,
		fileSize: fileSize - 1,
		active: active,
		dataReceived: dataReceived
	};
};

var _getStatus = function() {

	var status = {
		positions: []
	};

	var threads = _options.threads;

	var threadAvg = _getStatus_threads(threads);

	dataReceived = threadAvg.dataReceived;
	fileSize = threadAvg.fileSize;

	status.data = dataReceived + '/' + fileSize + ' bytes';
	status.speed = Math.round(dataReceived / seconds);
	status.completed = Math.floor(dataReceived / fileSize * 10000) / 100;
	status.time = Math.floor(seconds);
	status.eta = Math.floor((fileSize - dataReceived) * seconds / dataReceived);
	status.positions = threadAvg.positions;
	status.active = threadAvg.activeThreads;

	return status;
};

var _showStatus = function() {
	seconds += config.status_update_every / 1000;
	var status = _getStatus();
	if (config.analytics_logger == 'console') {
		ndConsoleLogger.logAnalytics(status);
	}
};

var _start = function() {
	//return;
	fileSize = _getStatus_threads(_options.threads).fileSize;
	console.log('Download remaining:', fileSize + ' bytes');
	seconds = 0;
	timer = setInterval(_showStatus, config.status_update_every);
};

var _stop = function() {
	_showStatus();
	clearInterval(timer);
	if (dataReceived != fileSize) {
		console.log('\nIncomplete download:');
		return false;
	} else {
		console.log("\nFile download completed");
		return true;
	}
};

module.exports = function(options) {
	_options = options;


	return {
		stop: _stop,
		start: _start
	};
};