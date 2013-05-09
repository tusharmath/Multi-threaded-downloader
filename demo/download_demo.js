var core = require('../lib/core');

var options = {
	url: 'http://nodejs.org/dist/v0.10.5/node-v0.10.5.pkg',
	checksum: 'sha1:4a7c59c37afa8ac7b6f2d1d83b34de30f24642ae'
};


var downloader = new core(options);
downloader.download();

/*
440 seconds video HD = 94260006
Speed required = 214227 bytes per sec
*/