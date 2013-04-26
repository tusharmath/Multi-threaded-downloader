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
	var threads = loadStatus();

	if (threads.length === 0) {
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
	} else {

		for (var j = 0; j < threads.length; j++) {
			var t = threads[j];
			if (t.position != t.end) {
				_threads.push({
					position: t.position,
					start: t.position,
					end: t.end
				});
			}
		}
	}
};

var _setPosition = function(i, position) {
	_saveStatus();
	threadAnalytics.dataReceived(position);
	_threads[i].position = _threads[i].position + position > _threads[i].end ? _threads[i].end : _threads[i].position + position;
	return _threads[i].position;
};

var _saveStatus = function() {

	var path = _options.logFile;
	fs.writeFile(path, JSON.stringify(_threads), {
		encoding: 'utf8'
	});

};

var loadStatus = function() {
	_options.dataReceived = 0;
	var path = _options.logFile;
	if (fs.existsSync(path)) {

		var dataJSON = fs.readFileSync(path, {
			encoding: 'utf8'
		});
		console.log('Download logs found:', path);
		var threads = JSON.parse(dataJSON);

		threads.forEach(function(r) {
			_options.dataReceived += (r.position - r.start);
		});
		return threads;
	}
	return [];
};


var _finish = function() {
	threadAnalytics.stop();
	if (!config.save_download_log) {
		fs.unlink(_options.logFile);
	}
};

var _createThreads = function() {

	_initThreads();
	if (_threads.length > 0) {

		console.log('Threads:', _threads.length);
		var r = {
			setPosition: _setPosition,
			getStatus: _threadStatus,
			finish: _finish
		};

		_options.threads = r;
		threadAnalytics = new ndStatus(_options);

		threadAnalytics.start();

		return r;
	}
};


module.exports = function(options) {

	_options = options;
	_options.logFile = config.download_path + _options.fileName + '.threads.json';
	_threads = [];


	return {
		createThreads: _createThreads

	};
};