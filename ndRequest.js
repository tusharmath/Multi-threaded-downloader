//Requires
var http = require("http");
var url = require('url');
var fs = require("./ndFileWrite");


//Variables
var _options;
var fsOptions = {};
var requestOptions;
var writer;


//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};



//Workers
var writeToFile = function(dataChunk) {
	writer.write(dataChunk.data, dataChunk.start);

};

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


		threadsRangeHeader.push({
			headerValue: headerValue,
			start: startRange,
			end: endRange
		});
		startRange += blockSize;
	}

	return threadsRangeHeader;
};

var responseDataListener = function(dataChunk) {

	console.log("Data received: ", dataChunk);
	
	
	writeToFile({
		start: rangeHeader.start,
		end: rangeHeader.end,
		data: dataChunk
	});
	
};

var responseEndListener = function() {
	console.log("File download complete");
};

var responseListener = function(response) {
	
	response.addListener('data', responseDataListener);
	response.addListener("end", responseEndListener);
};


var startDownload = function(rangeHeader) {

	requestOptions.headers = {
		range: rangeHeader.headerValue
	};

	console.log("Starting request: ", rangeHeader);

	http.get(requestOptions, responseListener).on('error', onError);


};

var fileSizeResponseListener = function(response) {
	fileSize = response.headers['content-length'];
	console.log("File size: ", fileSize + " bytes");
	var threadsRangeHeader = getThreadHeaders(fileSize);
	threadsRangeHeader.forEach(startDownload);
};



var getFileSize = function() {


	//Must be st by options
	var reqUrl = url.parse(_options.url);

	console.log("GET: ", reqUrl.href);
	requestOptions = {
		hostname: reqUrl.hostname,
		path: reqUrl.path
	};

	http.get(requestOptions, fileSizeResponseListener).on('error', onError);
};


//Exports
module.exports = function(options) {
	//console.log('options: ', options);
	_options = options;

	fsOptions.path = _options.path;
	writer = new fs(fsOptions);
	return {
		start: getFileSize
	};
};