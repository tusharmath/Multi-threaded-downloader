//Requires
var fs = require('fs');

var _options = {};
var _threads = [];


var _threadStatus = function() {
	return Math.floor((this.position - this.start) / (this.end - this.start) * 100);
};

var _initThreads = function(fileSize) {


	_options.threads = _options.threads > 1 ? _options.threads : 1;

	blockSize = Math.round(fileSize / _options.threads);

	console.log('Block Size:', blockSize, "bytes");

	var startRange = 0;

	while (startRange < fileSize) {
		var endRange = startRange + blockSize > fileSize ? fileSize : startRange + blockSize;

		var headerValue = 'bytes=';
		headerValue += startRange.toString();
		headerValue += '-';
		headerValue += endRange.toString();


		threads.push({
			header: headerValue,
			position: startRange,
			start: startRange,
			end: endRange,
			status: _threadStatus
		});
		startRange = endRange + 1;
	}
};

var _getHeader = function(i) {
	return threads[i].header;
};

var _getPosition = function(i) {
	return threads[i].position;
};

var _getStatus = function(i) {
	return threads[i].status();
};

var _setPostion = function(i, position) {
	threads[i].position += position;
	return threads[i].position;
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
	return {
		getHeader: _getHeader,
		getPosition: _getPosition,
		setPosition: _setPosition,
		//getStart: startRange,
		//end: endRange,
		getStatus: _threadStatus,
		saveStatus: _saveStatus
	};
};