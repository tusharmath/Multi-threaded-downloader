//Requires
var http = require("http");
var config = require('./ndOptions');
var url = require('url');
var fs = require("./ndFileWrite");
var ndThreads = require("./ndThreads");
var ndVerify = require('./ndVerify');

//Helper Methods
var onError = function(e) {
	console.log("Error: ", e);
};

//Workers
var createDownloadThread = function(index) {
	var onEnd = function() {
		threads.end(index);
		if (threads.isComplete()) {
			var retry = config.retry_on_failure;
			if (threads.isSuccessful()) {
				ndVerify.checksum(_options.fileName, _options.checksum);
			} else if (config.retry_on_failure) {
				console.log("Retrying...");
				_download();
			}
		}

	};

	var onData = function(dataChunk) {

		var position = threads.getStatus(index).position;
		threads.setPosition(index, dataChunk.length);
		writer.write(dataChunk, position);
	};

	var onResponse = function(response) {
		response.addListener('end', onEnd);
		response.addListener('data', onData);
	};

	var req = {
		headers: {
			'range': threads.getStatus(index).header
		},
		hostname: requestOptions.hostname,
		path: requestOptions.path
	};
	http.get(req, onResponse).on('error', onError);
};



var onHead = function(response) {
	_options.fileSize = response.headers['content-length'];


	console.log("File size: ", _options.fileSize + " bytes");
	var threader = ndThreads(_options);
	threads = threader.createThreads();
	response.destroy();
	if (threads !== undefined) {
		for (var i = 0; i < threads.count(); i++) {
			createDownloadThread(i);
		}
	} else {
		ndVerify.checksum(_options.fileName, _options.checksum);
	}
};


var _download = function() {
	var reqUrl = url.parse(_options.url);

	console.log("Host: ", reqUrl.host);
	requestOptions = {
		hostname: reqUrl.hostname,
		path: reqUrl.path,
		method: 'HEAD'
	};
	http.request(requestOptions, onHead)
		.on('error', onError)
		.end();
};


var getname = function(name) {
	name = decodeURIComponent(name);

	if (name.match(/\//g)) {
		var t1 = name.split('/');
		return getname(t1[t1.length - 1]);
	} else if (name.match(/\=/g)) {
		var t2 = name.split('=');
		return getname(t2[t2.length - 1]);
	}

	return name;
};

module.exports = function(options) {

	if (options.fileName === undefined) {
		options.fileName = getname(options.url);
	}

	_options = options;
	http.globalAgent.maxSockets = 200;
	http.Agent.defaultMaxSockets = 200;

	//Defaults
	writer = new fs(_options.fileName);

	return {
		download: _download
	};
};