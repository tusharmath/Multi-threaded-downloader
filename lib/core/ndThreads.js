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
	console.log('Creating increasing threads:', _options.threadCount);

	var mid = function(a, b) {
		return Math.round((a + b) / 2);
	};

	var fileSize = _options.fileSize;

	//var ratio = Math.round(fileSize / _options.threadCount / (_options.threadCount + 1) * 2);

	var i = 0;
	var startRange = mid(fileSize, 0);
	var endRange = fileSize;

	while (i < _options.threadCount - 1) {
		_threads.push({

			start: startRange,
			position: startRange,
			end: endRange

		});

		i++;
		endRange = startRange - 1;
		startRange = mid(0, endRange);
	}
	_threads.push({

		start: 0,
		position: 0,
		end: endRange

	});

	//console.log("THREADS", _threads);
};

var _initThreads = function() {
	console.log('Creating equal threads:', _options.threadCount);
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

	if (_options.increasing === true) {
		_initThreads_inc();
	} else {
		_initThreads();
	}

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