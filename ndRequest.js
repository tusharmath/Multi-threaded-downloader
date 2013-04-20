//Requires
var http = require("http");
var url = require('url');
var fs = require("./ndFileWrite");


//Variables
var _options;
var fsOptions = {};
var requestOptions;
var writer;
var threads = [];
var blockSize;
/*
{
	position : current,
	end:
	start:,
	header: reqheader.
	response:
}
*/


//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};



//Workers

var initializeThreads = function(fileSize) {
	var threadsRangeHeader = [];

	_options.thread = _options.thread > 1 ? _options.thread : 1;
	blockSize = Math.round(fileSize / _options.thread);
	console.log('Block Size:', blockSize);
	var startRange = 0;

	while (startRange < fileSize) {
		var endRange = startRange + blockSize > fileSize ? fileSize : startRange + blockSize;

		var headerValue = 'byte=';
		headerValue += startRange.toString();
		headerValue += '-';
		headerValue += endRange.toString();


		threadsRangeHeader.push({
			header: headerValue,
			position: startRange,
			start: startRange,
			end: endRange
		});
		startRange = endRange + 1;
	}

	threads = threadsRangeHeader;
	//console.log('Threads Created:', threads);
};

var responseEndListener = function() {
	console.log("File download complete");
};


var createDownloadThread = function(index) {
	var thread = threads[index];

	requestOptions.headers = {
		range: thread.header
	};

	console.log("Starting request thread: ", index);
	http.get(requestOptions, function(response) {
		threads[index].response = response;
		response.addListener('data', function(dataChunk) {
			//console.log("Thread: ", index, ", content length: " + dataChunk.length);
			writer.write(dataChunk, threads[index],

			function(written) {
				console.log("Thread: ", index, ", position: ", threads[index].position, "header: ", threads[index].header);
				threads[index].position += written;
				if (threads[index].position >= threads[index].end) {
					threads[index].response.destroy();
				}
			});
		});
		response.addListener("end", responseEndListener);
	}).on('error', onError);
};



var fileSizeResponseListener = function(response) {
	fileSize = response.headers['content-length'];
	console.log("File size: ", fileSize + " bytes");
	initializeThreads(fileSize);


	for (var i = 0; i < threads.length; i++) {

		createDownloadThread(i);
	}


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