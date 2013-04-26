//Requires
var fs = require('fs');
var config = require('./ndOptions');
var ndStatus = require('./ndStatus');

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
	_saveStatus();
	threadAnalytics.dataReceived(position);
	_threads[i].position = _threads[i].position + position > _threads[i].end ? _threads[i].end : _threads[i].position + position;
	return _threads[i].position;
};

var _saveStatus = function() {
	if (config.create_download_log) {
		var path = config.download_path + _options.fileName + '.threads.json';
		fs.writeFile(path, JSON.stringify(_threads));
	}
};


var _finish = function() {
	threadAnalytics.stop();
	_saveStatus();
};

var _createThreads = function() {

	_initThreads();
	//console.log('Threads:', _threads.length);
	var r = {
		setPosition: _setPosition,
		getStatus: _threadStatus,
		finish: _finish

	};
	_options.threads = r;
	threadAnalytics = new ndStatus(_options);

	threadAnalytics.start();

	return r;
};


module.exports = function(options) {

	_options = options;
	_threads = [];

	return {
		createThreads: _createThreads

	};
};