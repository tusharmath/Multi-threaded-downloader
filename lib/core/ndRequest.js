//Requires
var http = require("http");
var url = require('url');
var fs = require("./ndFileWrite");
var ndThreads = require("./ndThreads");
var logger = require("./ndConsoleLogger");


//Variables
var _options;

var requestOptions;
var writer;
var threads;
var completedThreads;
var seconds;
var dataReceived;
var timer;



//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};



//Workers
var showStatus = function() {

	var status = {};
	status.speed = Math.round(dataReceived / seconds);
	status.completed = Math.round(dataReceived / fileSize * 10000) / 100;
	status.time = Math.round(seconds);
	status.eta = Math.round((fileSize - dataReceived) * seconds / dataReceived);


	logger.logInline(
	[
		'speed: ', status.speed, 'bps\t',
		'completed:', status.completed, '%\t',
		'time:', status.time, 's\t',
		'eta:', status.eta, 's\t'].join(' '));

	seconds += _options.timerDuration / 1000;
};


var responseEndListener = function() {
	completedThreads++;
	if (completedThreads == _options.threadCount) {
		clearInterval(timer);

		if (_options.onDownloadComplete) {
			_options.onDownloadComplete(seconds);
		} else {

			showStatus();
			console.log("\nFile download completed");
		}
	}
};

var _onChunkSaved = function(err, written, buffer) {
	if (_options.onChunkComplete) {
		_options.onChunkComplete(this.index, written, threads);
	}
};

var createDownloadThread = function(index) {
	var treq = {
		headers: {
			'range': threads.getStatus()[index].header
		},
		hostname: requestOptions.hostname,
		path: requestOptions.path

	};


	http.get(treq, function(response) {
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
	console.log("File size: ", fileSize + " bytes");
	var threader = ndThreads({
		threadCount: _options.threadCount,
		fileSize: fileSize
	});
	threads = threader.createThreads();

	timer = setInterval(showStatus, _options.timerDuration);


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
		path: reqUrl.path,
		port: 80,
		method: 'HEAD'
	};
	http.request(requestOptions, fileSizeResponseListener)
		.on('error', onError)
		.end();

};


module.exports = function(options) {
	options.threadCount = options.threadCount || 1;
	options.timerDuration = options.timerDuration || 1000;
	_options = options;
	completedThreads = 0;
	seconds = 0;
	dataReceived = 0;

	return {
		download: _download
	};
};