var mtd = require('../lib');

var options = {
	url: 'http://nodejs.org/dist/v0.10.5/node-v0.10.5.pkg',
	checksum: 'sha1:4a7c59c37afa8ac7b6f2d1d83b34de30f24642ae',
	fileName: '/Users/tusharmathur/downloads/node-v0.10.5.pkg',
	threads: 32,
	method: 'GET',
	port: 80,
	range: '0-100'
};



var downloader = new mtd(options);

downloader.onStart = _onStart;
downloader.onEnd = _onEnd;
downloader.onThreadStart = _onThreadStart;
downloader.onThreadComplete = _onThreadComplete;
downloader.onThreadFail = _onThreadFail;

downloader.start('/Users/tusharmathur/node-download.mtd');
//OR 
downloader.start();

downloader.stop();
downloader.restart();

/*
440 seconds video HD = 94260006
Speed required = 214227 bytes per sec
*/