//REQUIRE
var sys = require("sys");
var http = require("http");
var url = require("url");
var fs = require("fs");

//VARIABLES
var dlprogress = 0;
var fileSize = 0;
var options = {
	downloadPath: "http://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png",
	savePath: './../Temp/'
};
options.savePath += options.downloadPath.split('/').pop();

//METHODS
var showStatus = function() {

	var bytesDownloaded;
	if (dlprogress > 1000 * 1000 * 1000) {
		bytesDownloaded = (dlprogress / (1000 * 1000 * 1000)).toString() + ' Gb';
	} else if (dlprogress > 1000 * 1000) {
		bytesDownloaded = (dlprogress / (1000 * 1000)).toString() + ' Mb';
	} else if (dlprogress > 1000) {
		bytesDownloaded = (dlprogress / (1000)).toString() + ' Kb';
	} else {
		bytesDownloaded = (dlprogress).toString() + ' bytes';
	}

	console.log("Download progress: " + Math.round(dlprogress / fileSize * 100) + "% complete, " + bytesDownloaded);

};

var onError = function(e) {
	throw e;
};

var writeStream = fs.createWriteStream(options.savePath, {
	encoding: 'binary'
});
var body = '';


var responseDataListener = function(dataChunk) {
	dlprogress += dataChunk.length;
	writeStream.write(dataChunk);
};

var responseEndListener = function() {
	showStatus();
	console.log("File download complete");
	clearInterval(dlTimer);
};

var responseListener = function(response) {
	console.log("Download started");
	dlTimer = setInterval(showStatus, 1000);
	fileSize = response.headers['content-length'];
	//console.log("ResponseHeaders", response.headers);

	console.log("File size: " + fileSize + " bytes.");

	response.addListener('data', responseDataListener);
	response.addListener("end", responseEndListener);


};

var requestOptions = {
	hostname: 'upload.wikimedia.org',
	path: '/wikipedia/commons/6/63/Wikipedia-logo.png'
};

console.log('Download starting');
http.get(requestOptions, responseListener).on('error', onError);
//http.get(options.downloadPath, responseListener).on('error', onError);