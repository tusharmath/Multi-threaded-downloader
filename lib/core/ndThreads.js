//Requires
var fs = require('fs');

var _options;
var _threads;

var _header = function(startRange, endRange) {
	var headerValue = 'bytes=';
	headerValue += startRange.toString();
	headerValue += '-';
	headerValue += endRange.toString();
	return headerValue;
};

var _threadStatus = function() {
	var status = [];
	_threads.forEach(function(t) {
		status.push({
			start: t.start,
			end: t.end,
			position: t.position,
			header: _header(t.start, t.end)
		});
	});
	return status;
};



var _initThreads_inc = function() {

	var fileSize = _options.fileSize;

	var ratio = Math.round(fileSize / _options.threadCount / (_options.threadCount + 1) * 2);

	var i = 0;
	var startRange = 0;
	var endRange = ratio;

	while (i < _options.threadCount) {
		_threads.push({

			start: startRange,
			position: startRange,
			end: endRange

		});
		i++;
		startRange = endRange + 1;

		endRange = endRange * 2 > fileSize ? fileSize : endRange * 2;
	}

	console.log(_threads);


};

var _initThreads = function() {
	var fileSize = _options.fileSize;

	var _blockSize = Math.round(fileSize / _options.threadCount);

	console.log('Block Size:', _blockSize, "bytes");

	var startRange = 0;

	while (startRange < fileSize) {
		var endRange = startRange + _blockSize > fileSize ? fileSize : startRange + _blockSize;

		_threads.push({
			position: startRange,
			start: startRange,
			end: endRange
		});
		startRange = endRange + 1;
	}
};

var _setPosition = function(i, position) {
	_threads[i].position += position;
	return _threads[i].position;
};

var _saveStatus = function(callback) {
	var data = {
		options: _options,
		threads: _threads
	};
	fs.writeFile(JSON.stringify(data), _options.fileName + '.mt.json', callback);
};

var _createThreads = function() {

	if (_options.inc === true) _initThreads_inc();
	else _initThreads();
	return {
		setPosition: _setPosition,
		getStatus: _threadStatus,
		saveStatus: _saveStatus
	};
};

module.exports = function(options) {

	_options = options;
	_threads = [];
	return {
		createThreads: _createThreads
	};
};