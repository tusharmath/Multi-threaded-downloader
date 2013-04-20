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
var statusTimer;
var seconds = 0;
var completedThreads = 0;


//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};

var threadStatus = function() {
	return Math.floor((this.position - this.start) / (this.end - this.start) * 100);
};


//Workers

var showStatus = function() {

	statusTimer = setInterval(function() {
		var str = [];
		var overall = 0;
		seconds++;
		for (var i = 0; i < threads.length; i++) {
			str.push(threads[i].status() + '%');
			overall += threads[i].status();
		}
		console.log(str.join('\t'), "\toverall:", Math.floor(overall / threads.length), '% @', Math.round(overall / 100 / threads.length * fileSize / seconds / 1000), "KB/s");
	}, 1000);
};

var initializeThreads = function(fileSize) {
	var threadsRangeHeader = [];

	_options.thread = _options.thread > 1 ? _options.thread : 1;
	blockSize = Math.round(fileSize / _options.thread);
	console.log('Block Size:', blockSize);
	var startRange = 0;

	while (startRange < fileSize) {
		var endRange = startRange + blockSize > fileSize ? fileSize : startRange + blockSize;

		var headerValue = 'bytes=';
		headerValue += startRange.toString();
		headerValue += '-';
		headerValue += endRange.toString();


		threadsRangeHeader.push({
			header: headerValue,
			position: startRange,
			start: startRange,
			end: endRange,
			status: threadStatus
		});
		startRange = endRange + 1;
	}

	threads = threadsRangeHeader;
	//console.log('Threads Created:', threads);
};

var responseEndListener = function() {
	completedThreads++;
	if (completedThreads == threads.length) {
		clearInterval(statusTimer);
		console.log("File download completed in", seconds, "seconds");
	}
};


var createDownloadThread = function(index) {
	var thread = threads[index];

	requestOptions.headers = {
		'range': thread.header
	};

	http.get(requestOptions, function(response) {
		threads[index].response = response;
		response.addListener('end', responseEndListener);
		response.addListener('data', function(dataChunk) {
			var position = threads[index].position;
			threads[index].position += dataChunk.length;
			writer.write(dataChunk, position);

		});

	}).on('error', onError);
};



var fileSizeResponseListener = function(response) {
	fileSize = response.headers['content-length'];
	console.log("File size: ", fileSize + " bytes");
	initializeThreads(fileSize);
	showStatus();

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