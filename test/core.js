var core = require('../lib/core');
var fs = require('fs');


exports.downloadTest = function(test) {

	var read = [];
	var _onDownloadComplete = function(seconds) {
		console.log('\nDownload completed in', seconds, 'seconds');
		var d = fs.readFileSync('./test/core.downloaded.png');
		var o = fs.readFileSync('./test/core.orignal.png');
		test.expect(1);
		//console.log(downloaded.length, orignal.length);
		test.equal(d.length, o.length);

		test.done();
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