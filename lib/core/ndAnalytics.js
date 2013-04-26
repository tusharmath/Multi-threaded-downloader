var config = require("./ndOptions");


var _getStatus_dataRecieved = function(threads) {
	var dataReceived = 0;
	threads.forEach(function(t) {
		dataReceived += (t.position - t.start);
	});
	return dataReceived;
};

var _getStatus_threads = function(threads) {
	var positions = [];
	threads.getStatus().forEach(function(t) {
		var val = Math.floor((t.position - t.start) * 10000 / (t.end - t.start)) / 100;
		val = val.toString();
		positions.push(val);
	});
	return positions;
};

var _getStatus = function() {

	var status = {
		positions: []
	};

	var threads = _options.threads.getStatus();
	dataReceived = _getStatus_dataRecieved(threads);

	status.data = dataReceived + '/' + _options.fileSize + ' bytes';
	status.speed = Math.round(dataReceived / seconds);
	status.completed = Math.round(dataReceived / _options.fileSize * 10000) / 100;
	status.time = Math.round(seconds);
	status.eta = Math.round((_options.fileSize - dataReceived) * seconds / dataReceived);
	status.threads = _getStatus_threads(threads);

	_options.callback(status);
};

var _start = function() {
	//return;
	timer = setInterval(_showStatus, config.status_update_every);
};

var _stop = function() {
	_showStatus();
	clearInterval(timer);
	if (dataReceived != _options.fileSize) {
		console.log('Incomplete download');
	}

};

module.exports = function(options) {
	_options = options;
	seconds = 0;

	return {
		stop: _stop,
		start: _start
	};
};