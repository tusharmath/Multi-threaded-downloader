//REQUIRE
var sys = require("sys");
var http = require("http");
var url = require("url");
var fs = require("fs");

//VARIABLES
var dlprogress = 0;
var fileSize = 0;
var options = {
	downloadPath: "http://localhost:3000/images/IMG_0028.JPG",
	savePath:  './../Temp/'
};
options.savePath += options.downloadPath.split('/').pop();

//METHODS
var showStatus = function() {
	console.log("Download progress: " + Math.round(dlprogress / fileSize * 100) + "% complete, " + dlprogress + " bytes");

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
	fileSize = response.headers['content-length'];

	console.log("File size: " + fileSize + " bytes.");

	response.addListener('data', responseDataListener);
	response.addListener("end", responseEndListener);


};

http.get(options.downloadPath, responseListener).on('error', onError);



var dlTimer = setInterval(showStatus, 100);