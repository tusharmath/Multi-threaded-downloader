//Requires
var fs = require('fs');

var _options = {};
var _threads = [];



var _threadStatus = function() {
	var status = [];
	_threads.forEach(function(t) {
		status.push({
			start: t.start,
			end: t.end,
			position: t.position,
			saved: t.saved,
			blockSize: t.blockSize,
			header: t.header
		});
	});
	return status;
};

var _initThreads = function() {
	var fileSize = _options.fileSize;

	var _blockSize = Math.round(fileSize / _options.threads);

	console.log('Block Size:', _blockSize, "bytes");

	var startRange = 0;

	while (startRange < fileSize) {
		var endRange = startRange + _blockSize > fileSize ? fileSize : startRange + _blockSize;

		var headerValue = 'bytes=';
		headerValue += startRange.toString();
		headerValue += '-';
		headerValue += endRange.toString();


		_threads.push({
			header: headerValue,
			position: startRange,
			start: startRange,
			end: endRange,
			status: _threadStatus,
			blockSize: _blockSize
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



exports.createThreads = function(options) {
	_options = options;
	_initThreads();
	return {
		setPosition: _setPosition,
		getStatus: _threadStatus,
		saveStatus: _saveStatus
	};
};