var keys = {
	downloadPath: "http://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png",
	savePath: 'download.png'

};

var sys = require("sys");
var http = require("http");
var url = require("url");
var dlprogress = 0;
var onError = function(e) {
	throw e;
};
var fs = require("fs");
var writeStream = fs.createWriteStream(keys.savePath, {
	encoding: 'binary'
});
var body = '';


var responseDataListener = function(dataChunk) {
	dlprogress += dataChunk.length;
	body += dataChunk;
};

var onWriteComplete = function() {
	console.log("File saved: ", keys.savePath);
};

var responseEndListener = function() {
	console.log("Writing to file: ", keys.savePath);
	fs.writeFile(keys.savePath, body, {}, onWriteComplete);

};


var responseListener = function(response) {
	console.log("Download started");



	console.log("File size: " + response.headers['content-length'] + " bytes.");
	response.pipe(writeStream);

	//response.addListener('data', responseDataListener);
	//response.addListener("end", responseEndListener);


};

http.get(keys.downloadPath, responseListener).on('error', onError);


/*
setInterval(function() {
	console.log("Download progress: " + dlprogress + " bytes");
}, 1000);
*/