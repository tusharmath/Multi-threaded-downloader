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

var _initThreads_inc_lin = function() {
	console.log('Creating linearly increasing threads:', _options.threadCount);

	var fileSize = Number(_options.fileSize);

	var ratio = Math.round(fileSize / _options.threadCount / (_options.threadCount + 1) * 2);

	var i = 0;
	var startRange = 0;
	var endRange = ratio ;

	while (i < _options.threadCount) {
		_threads.push({

			start: startRange,
			position: startRange,
			end: endRange

		});
		i++;
		startRange = endRange + 1;

		endRange = endRange + ratio * (i + 1) > fileSize ? fileSize : endRange + ratio * (i + 1);
	}
};


var _initThreads_inc_fib = function() {
	console.log('Creating increasing threads fibonacci style:', _options.threadCount);

	var mid = function(a, b) {
		return Math.round((a + b) / 2);
	};

	var fileSize = Number(_options.fileSize);

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

	_threads.reverse();

	//console.log("THREADS", _threads);
};

var _initThreads = function() {
	console.log('Creating equal threads:', _options.threadCount);
	var fileSize = Number(_options.fileSize);

	var _blockSize = Math.round(fileSize / _options.threadCount);

	console.log('Block Size:', _blockSize, "bytes");

	var startRange = 0;
	var endRange = _blockSize;
	do {


		_threads.push({
			position: startRange,
			start: startRange,
			end: endRange
		});
		startRange = endRange + 1;
		endRange = endRange + _blockSize > fileSize ? fileSize : endRange + _blockSize;

	} while (startRange < fileSize);

};

var _setPosition = function(i, position) {

	_threads[i].position = _threads[i].position + position > _threads[i].end ? _threads[i].end : _threads[i].position + position;
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

	if (_options.type == 'fib') {
		_initThreads_inc_fib();
	} else if (_options.type == 'lin') {
		_initThreads_inc_lin();
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