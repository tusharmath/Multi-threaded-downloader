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
var seconds = 0;
var dataReceived = 0;
var timer;
var timerDuration = 1000;


//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};



//Workers

var showStatus = function() {
	seconds += timerDuration / 1000;
	console.log('Avg Speed:', dataReceived / seconds + ' bps', 'Completed:', dataReceived / fileSize * 100 + '%', 'time:', seconds, ' seconds');
};


var responseEndListener = function() {
	completedThreads++;
	if (completedThreads == _options.threadCount) {
		clearInterval(timer);

		if (_options.onDownloadComplete) {
			_options.onDownloadComplete(seconds);
		} else {
			console.log("File download completed");
			showStatus();
		}
	}
};

var _onChunkSaved = function(err, written, buffer) {
	if (_options.onChunkComplete) {
		_options.onChunkComplete(this.index, written, threads);
	}
};

var createDownloadThread = function(index) {
	requestOptions.headers = {
		'range': threads.getStatus()[index].header
	};


	http.get(requestOptions, function(response) {
		response.addListener('end', responseEndListener);
		response.addListener('data', function(dataChunk) {
			dataReceived += dataChunk.length;
			var position = threads.getStatus()[index].position;
			threads.setPosition(index, dataChunk.length);
			writer.write(dataChunk, position, _onChunkSaved);
		});

	}).on('error', onError);
};



var fileSizeResponseListener = function(response) {
	fileSize = response.headers['content-length'];
	threads = ndThreads.createThreads({
		threadCount: _options.threadCount,
		fileSize: fileSize
	});

	timer = setInterval(showStatus, timerDuration);

	console.log("File size: ", fileSize + " bytes");
	for (var i = 0; i < _options.threadCount; i++) {
		createDownloadThread(i);
	}
};


var _download = function() {
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


module.exports = function(options) {
	options.threadCount = options.threadCount || 1;
	_options = options;
	return {
		download: _download
	};
};