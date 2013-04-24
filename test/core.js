var core = require('../lib/core');
var fs = require('fs');


exports.downloadTest = function(test) {

	var read = [];
	var _onRead = function(data) {
		read.push(data);
		if (read.length === 2) {
			test.expect(1);
			//console.log(downloaded.length, orignal.length);
			test.equal(read[0], read[1]);
			test.done();
		}
	};

	var _onDownloadComplete = function(seconds) {
		console.log('Download completed in', seconds, 'seconds');
		fs.readFile('./test/core.downloaded.png', null, _onRead);
		fs.readFile('./test/core.orignal.png', null, _onRead);
	};

	var options = {
		path: './test/core.downloaded.png',
		url: 'http://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
		threadCount: 4,
		//onChunkComplete: _onChunkComplete,
		onDownloadComplete: _onDownloadComplete
	};

	var downloader = new core(options);
	downloader.download();


};