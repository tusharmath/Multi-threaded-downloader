//Requires
var fs = require('fs');
var config = require('./ndOptions');
var ndDownloadLogger = require('./ndDownloadLogger');
var ndAnalytics = require('./ndAnalytics');

var _options;
var _threads;

var _header = function(startRange, endRange) {
	var headerValue = 'bytes=';
	headerValue += startRange.toString();
	headerValue += '-';
	headerValue += endRange.toString();
	return headerValue;
};

var _getStatus = function(i) {
	var status;
	var t = _threads[i];
	status = {
		start: t.start,
		end: t.end,
		position: t.position,
		header: _header(t.start, t.end)
	};
	return status;
};


var _initThreads = function(dThreads) {
	if (dThreads !== undefined) {
		return dThreads;
	}
	var threads = [];
	var fileSize = Number(_options.fileSize);
	var _blockSize = Math.ceil(fileSize / config.thread_count);

	console.log('Block Size:', _blockSize, "bytes");

	var startRange = 0;
	var endRange = _blockSize;
	var i = 0;

	do {
		threads.push({
			position: startRange,
			start: startRange,
			end: endRange
		});
		i++;
		startRange = endRange + 1;
		endRange = _blockSize * (i + 1);

	} while (i != config.thread_count);

	threads[threads.length - 1].end += _options.fileSize - threads[threads.length - 1].end;
	return threads;
};

var _setPosition = function(i, position) {
	_ndDownloadLogger.save(_threads);
	_threads[i].position = _threads[i].position + position > _threads[i].end ? _threads[i].end : _threads[i].position + position;
	return _threads[i].position;
};



var _finish = function() {
	_ndDownloadLogger.save(_threads);
	var succeed = _ndAnalytics.stop();
	if (!config.save_download_log) {
		if (succeed) {
			_ndDownloadLogger.remove();
		}
	}
};

var _restart = function(index) {
	_threads.start = threads.position;
	_ndDownloadLogger.save(_threads);
};

var _count = function() {
	return _threads.length;
};

var _createThreads = function() {
	var threads = _ndDownloadLogger.load();
	_threads = _initThreads(threads);

	if (_threads.length > 0) {

		console.log('Threads created:', _threads.length);

		var r = {
			setPosition: _setPosition,
			getStatus: _getStatus,
			count: _count,
			finish: _finish,
			restart: _restart
		};

		_options.threads = r;
		_ndAnalytics = new ndAnalytics(_options);
		_ndAnalytics.start();
		return r;
	} else {
		console.log('File already downloaded!');
	}
};


module.exports = function(options) {

	_options = options;
	_options.logFile = config.download_path + _options.fileName + '.nd.json';
	_threads = [];
	_ndDownloadLogger = new ndDownloadLogger(_options);
	return {
		createThreads: _createThreads

	};
};