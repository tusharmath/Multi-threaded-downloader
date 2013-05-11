var config = require("./ndOptions");
var ndConsoleLogger = require('./ndConsoleLogger');

var _getStatus_threads = function(threads) {
	var positions = [];
	var active = 0;
	var failed = 0;
	var completed = 0;
	var dataReceived = 0;
	var downloadSize = 0;
	var i = 0;

	while (i < threads.count()) {

		//THREAD POSITIONS
		var t = threads.getStatus(i++);
		var val = Math.floor((t.position - t.start) * 10000 / (t.end - t.start)) / 100;
		val = val.toString();
		positions.push(val);

		//ACTIVE THREADS
		if (t.connection == 'open') {
			active++;
		}

		//COMPLETED THREADS
		if (t.connection == 'closed') {
			completed++;
		}

		//FAILED THREADS
		if (t.connection == 'failed') {
			failed++;
		}
		
		//FILE SIZE
		downloadSize += (t.end - t.start + 1);

		//DATA RECIEVED
		dataReceived += (t.position - t.start + 1);

	}


	return {
		threadPositions: positions,
		downloadSize: downloadSize - 1,
		active: active,
		dataReceived: dataReceived - 1,
		completedThreads: completed,
		failedThreads: failed
	};
};

var _getStatus = function() {

	var status = {};


	var threads = _options.threads;

	var threadAvg = _getStatus_threads(threads);

	dataReceived = threadAvg.dataReceived;
	downloadSize = threadAvg.downloadSize;

	status.dataReceived = dataReceived;
	status.downloadSize = downloadSize;
	status.speed = Math.round(dataReceived / seconds);
	status.completed = Math.floor(dataReceived / downloadSize * 10000) / 100;
	status.time = Math.floor(seconds);
	status.eta = Math.floor((downloadSize - dataReceived) * seconds / dataReceived);
	status.threadPositions = threadAvg.threadPositions;
	status.openConnections = threadAvg.active;
	status.closedConnections = threadAvg.completedThreads;
	status.failedConnections = threadAvg.failedThreads;

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
	downloadSize = _getStatus_threads(_options.threads).downloadSize;
	console.log('Download remaining:', downloadSize + ' bytes');
	seconds = 0;
	timer = setInterval(_showStatus, config.status_update_every);
};

var _stop = function() {
	_showStatus();
	clearInterval(timer);
	if (dataReceived != downloadSize) {
		console.log('\nDownloaded:', dataReceived, 'Expected:', downloadSize);
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