//Requires
var http = require("http");
var config = require('./ndOptions');
var url = require('url');
var fs = require("./ndFileWrite");
var ndThreads = require("./ndThreads");



//Variables
var _options;

var requestOptions;
var threads;
var completedThreads;

//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
	//throw e;
};



//Workers



var createDownloadThread = function(index) {
	var onEnd = function() {
		//return;
		var t = threads.getStatus()[index];
		if (t.end != t.position) console.log(' thread failed:', t.header, t.position);
		completedThreads++;

		if (completedThreads == config.thread_count) {
			//console.log('Threads:', threads.getStatus());
			threads.finish();
			if (_options.onDownloadComplete) {
				_options.onDownloadComplete(seconds);
			} else {
				console.log("\nFile download completed");
			}
		}
	};

	var onData = function(dataChunk) {
		var position = threads.getStatus()[index].position;
		threads.setPosition(index, dataChunk.length);
		//console.log('position:', threads.getStatus());
		writer.write(dataChunk, position);

	};

	var onResponse = function(response) {
		//console.log(red + 'connected to :' + reset, response.headers);
		response.addListener('end', onEnd);
		response.addListener('data', onData);

	};



	var req = {
		headers: {
			'range': threads.getStatus()[index].header
		},
		hostname: requestOptions.hostname,
		path: requestOptions.path
	};
	http.get(req, onResponse).on('error', onError);
};



var onHead = function(response) {
	//console.log('Headers:', response.headers);
	_options.fileSize = response.headers['content-length'];
	response.destroy();

	console.log("Download size: ", _options.fileSize + " bytes");

	var threader = ndThreads(_options);
	threads = threader.createThreads();

	//TODO: Enable logging


	for (var i = 0; i < threads.getStatus().length; i++) {
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
	http.request(requestOptions, onHead)
		.on('error', onError)
		.end();

};


module.exports = function(options) {

	_options = options;
	http.globalAgent.maxSockets = 200;
	http.Agent.defaultMaxSockets = 200;

	//Defaults
	completedThreads = 0;
	writer = new fs(_options.fileName);

	return {
		download: _download
	};
};