//Requires
var fs = require('fs');

var _options = {};
var _threads = [];



var _threadStatus = function() {
	return this.position - this.start;
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

var _getHeader = function(i) {
	return _threads[i].header;
};

var _getPosition = function(i) {
	return _threads[i].position;
};

var _getStatus = function(i) {
	return _threads[i].status();
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

var _getBlockSize = function(i) {
	return _threads[i].blockSize;
};

var _getStart = function(i) {
	return _threads[i].start;
};

exports.createThreads = function(options) {
	_options = options;
	_initThreads();
	return {
		getHeader: _getHeader,
		getPosition: _getPosition,
		setPosition: _setPosition,
		getStart: _getStart,
		//end: endRange,
		getBlockSize: _getBlockSize,
		getStatus: _threadStatus,
		saveStatus: _saveStatus
	};
};