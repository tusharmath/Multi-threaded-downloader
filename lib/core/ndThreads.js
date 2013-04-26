//Requires
var fs = require('fs');
var config = require('./ndOptions');
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
	console.log('Creating linearly increasing threads:', config.thread_count);

	var fileSize = Number(_options.fileSize);

	var ratio = Math.round(fileSize / config.thread_count / (config.thread_count + 1) * 2);

	var i = 0;
	var startRange = 0;
	var endRange = ratio;

	while (i < config.thread_count) {
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
	console.log('Creating increasing threads fibonacci style:', config.thread_count);

	var mid = function(a, b) {
		return Math.round((a + b) / 2);
	};

	var fileSize = Number(_options.fileSize);

	//var ratio = Math.round(fileSize / config.thread_count / (config.thread_count + 1) * 2);

	var i = 0;
	var startRange = mid(fileSize, 0);
	var endRange = fileSize;

	while (i < config.thread_count - 1) {
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
	console.log('Creating equal threads:', config.thread_count);
	var fileSize = Number(_options.fileSize);

	var _blockSize = Math.ceil(fileSize / config.thread_count);

	console.log('Block Size:', _blockSize, "bytes");

	var startRange = 0;
	var endRange = _blockSize;
	var i = 0;

	do {


		_threads.push({
			position: startRange,
			start: startRange,
			end: endRange
		});
		i++;
		startRange = endRange + 1;
		endRange = _blockSize * (i + 1);

	} while (i != config.thread_count);
	_threads[_threads.length - 1].end += _options.fileSize - _threads[_threads.length - 1].end;
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
	fs.writeFile(JSON.stringify(data), _options.fileName + '.threads.json', callback);
};

var _createThreads = function() {

	if (_options.type == 'fib') {
		_initThreads_inc_fib();
	} else if (_options.type == 'lin') {
		_initThreads_inc_lin();
	} else {
		_initThreads();
	}
	/*
	_threads.forEach(function(t) {
		console.log('block:', t.end - t.start);
	});
	*/
	//console.log('Threads:', _threads.length);
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