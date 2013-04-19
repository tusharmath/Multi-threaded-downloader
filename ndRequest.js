//Variables
var _options;
var http = require("http");



//Helper Methods
var onError = function(e) {
	throw e;
};



//Workers
var getThreadHeaders = function(fileSize) {
	var threadsRangeHeader = [];

	_options.thread = _options.thread > 1 ? _options.thread : 1;
	var blockSize = fileSize / _options.thread;
	var startRange = 0;

	while (startRange < fileSize) {
		var endRange = startRange + blockSize > fileSize ? fileSize : startRange + blockSize;

		var headerValue = 'byte=';
		headerValue += startRange.toString();
		headerValue += '-';
		headerValue += endRange.toString();
		startRange += blockSize;

		threadsRangeHeader.push({
			headerValue: headerValue,
			start: startRange,
			end: endRange
		});
		fileSize -= blockSize;
	}

	return threadsRangeHeader;
};


var startDownload = function(rangeHeader) {

	var requestOptions = {
		hostname: 'upload.wikimedia.org',
		path: '/wikipedia/commons/6/63/Wikipedia-logo.png',
		headers: {
			range: rangeHeader.headerValue
		}
	};

	var responseDataListener = function(dataChunk) {
		_options.callback({
			start: rangeHeader.start,
			end: rangeHeader.end,
			data: dataChunk
		});
	};

	http.get(requestOptions, responseDataListener).on('error', onError);


};

var responseListener = function(response) {
	fileSize = response.headers['content-length'];
	var threadsRangeHeader = getThreadHeaders(fileSize);

};

var getFileSize = function() {

	//Must be st by options
	var requestOptions = {
		hostname: 'upload.wikimedia.org',
		path: '/wikipedia/commons/6/63/Wikipedia-logo.png'
	};

	http.get(requestOptions, responseListener).on('error', onError);
};


//Exports
module.exports = function(options) {
	_options = options;


};