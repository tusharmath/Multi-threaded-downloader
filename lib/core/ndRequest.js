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

var red, blue, reset;
red = '\033[31m';
blue = '\033[34m';
reset = '\033[0m';


//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};



//Workers
var showStatus = function() {

	var status = {
		positions: []
	};
	status.speed = Math.round(dataReceived / seconds);
	status.completed = Math.round(dataReceived / fileSize * 10000) / 100;
	status.time = Math.round(seconds);
	status.eta = Math.round((fileSize - dataReceived) * seconds / dataReceived);
	status.runningThreads = _options.threadCount - completedThreads;
	threads.getStatus().forEach(function(t) {
		var val = Math.floor((t.position - t.start) * 10000 / (t.end - t.start)) / 100;
		val = val.toString() + '%';
		status.positions.push(val);

		//console.log((t.position - t.start) / (t.end - t.start));
	});

	logger.logInline(
	[
		'speed: ', status.speed + 'bps\t',
		'completed:', status.completed + '%\t',
		'time:', status.time + 's\t',
		'eta:', status.eta + 's\t',
		'threads:', status.positions.join(' | ')].join(' '));

	seconds += _options.timerDuration / 1000;

	//	console.log(threads.getStatus());
};


var responseEndListener = function() {

	completedThreads++;
	//console.log('Threads completed:', completedThreads);
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
	if (err) console.log("ERROR:", err);
	if (_options.onChunkComplete) {
		_options.onChunkComplete(this.index, written, threads);
	}
};

var createDownloadThread = function(index) {


	var onData = function(dataChunk) {

		dataReceived += dataChunk.length;
		var position = threads.getStatus()[index].position;
		threads.setPosition(index, dataChunk.length);

		writer.write(dataChunk, position, _onChunkSaved);

	};

	var onResponse = function(response) {
		//console.log(red + 'connected to :' + reset, response.headers);
		response.addListener('end', responseEndListener);
		response.addListener('data', onData);

	};



	var treq = {
		headers: {
			'range': threads.getStatus()[index].header
		},
		hostname: requestOptions.hostname,
		path: requestOptions.path
	};
	http.get(treq, onResponse).on('error', onError);
};



var fileSizeResponseListener = function(response) {
	//console.log('Headers:', response.headers);
	fileSize = response.headers['content-length'];
	console.log("File size: ", fileSize + " bytes");

	var threader = ndThreads({
		threadCount: _options.threadCount,
		fileSize: fileSize,
		increasing: _options.increasing
	});
	threads = threader.createThreads();

	//TODO: Enable logging
	timer = setInterval(showStatus, _options.timerDuration);


	for (var i = 0; i < _options.threadCount; i++) {
		createDownloadThread(i);
	}
};


var _download = function() {

	var reqUrl = url.parse(_options.url);

	console.log("Downloading: ", reqUrl.host);
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

	//Defaults
	completedThreads = 0;
	seconds = 0;
	dataReceived = 0;


	writer = new fs({
		path: _options.path
	});


	return {
		download: _download
	};
};