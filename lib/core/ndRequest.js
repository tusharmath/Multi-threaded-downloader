//Requires
var http = require("http");
var url = require('url');
var fs = require("./ndFileWrite");
var ndThreads = require("./ndThreads");



//Variables
var _options;

var requestOptions;
var writer;
var threads;

var completedThreads = 0;
var dataWritten = 0;
var seconds = 0;



//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};



//Workers
var timer = setInterval(function() {
	seconds++;
}, 1000);

var responseEndListener = function() {
	completedThreads++;
	if (completedThreads == _options.threadCount) {
		clearInterval(timer);
		console.log("File download completed in " + seconds + " seconds.");
	}
};

var updateDataWritten = function(err, written, buffer) {
	dataWritten += written;
};

var createDownloadThread = function(index) {
	requestOptions.headers = {
		'range': threads.getHeader(index)
	};


	http.get(requestOptions, function(response) {
		response.addListener('end', responseEndListener);
		response.addListener('data', function(dataChunk) {
			var position = threads.getPosition(index);
			threads.setPosition(index, dataChunk.length);
			writer.write(dataChunk, position, updateDataWritten);
		});

	}).on('error', onError);
};



var fileSizeResponseListener = function(response) {
	fileSize = response.headers['content-length'];
	threads = ndThreads.createThreads({
		threads: _options.threadCount,
		fileSize: fileSize
	});

	console.log("File size: ", fileSize + " bytes");
	for (var i = 0; i < _options.threadCount; i++) {
		createDownloadThread(i);
	}
};



exports.download = function(options) {
	options.threadCount = options.threadCount || 1;
	_options = options;

	writer = new fs({
		path: _options.path
	});


	var reqUrl = url.parse(_options.url);

	console.log("Downloading: ", reqUrl.href);
	requestOptions = {
		hostname: reqUrl.hostname,
		path: reqUrl.path
	};

	http.get(requestOptions, fileSizeResponseListener).on('error', onError);
};