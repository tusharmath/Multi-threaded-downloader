//Requires
var http = require("http");
var url = require('url');
var fs = require("./ndFileWrite");
var ndThreads = require("./ndThreads");
var ndStatus = require("./ndStatus");


//Variables
var _options;

var requestOptions;
var writer;
var threads;
var completedThreads;



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



var _onChunkSaved = function(err, written, buffer) {
	if (err) console.log("ERROR:", err);
	if (_options.onChunkComplete) {
		_options.onChunkComplete(this.index, written, threads);
	}
};

var createDownloadThread = function(index) {


	var onEnd = function() {
		//return;
		var t = threads.getStatus()[index];
		if (t.end != t.position) console.log(' thread failed:', t.header, t.position);
		completedThreads++;

		if (completedThreads == _options.threadCount) {
			//console.log('Threads:', threads.getStatus());
			threadStatus.stop();
			if (_options.onDownloadComplete) {
				_options.onDownloadComplete(seconds);
			} else {
				console.log("\nFile download completed");
			}
		}
	};

	var onData = function(dataChunk) {


		threadStatus.dataReceived(dataChunk.length);
		var position = threads.getStatus()[index].position;
		threads.setPosition(index, dataChunk.length);

		writer.write(dataChunk, position, _onChunkSaved);

	};

	var onResponse = function(response) {
		//console.log(red + 'connected to :' + reset, response.headers);
		response.addListener('end', onEnd);
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
		type: _options.type
	});
	threads = threader.createThreads();

	threadStatus = new ndStatus({
		timerDuration: _options.timerDuration,
		threads: threads,
		fileSize: fileSize
	});

	threadStatus.start();

	//TODO: Enable logging


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

	_options = options;
	http.globalAgent.maxSockets = 200;
	http.Agent.defaultMaxSockets = 200;

	//Defaults
	completedThreads = 0;
	seconds = 0;



	writer = new fs({
		path: _options.path
	});



	return {
		download: _download
	};
};