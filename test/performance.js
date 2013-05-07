var core = require('../lib/core');


var options = {
	fileName: 'jquery-1.9.1.js',
	url: 'http://code.jquery.com/jquery-1.9.1.js',
	checksum: 'sha1:9257afd2d46c3a189ec0d40a45722701d47e9ca5'

};
var downloader = new core(options);
downloader.download();

/*
440 seconds video HD = 94260006
Speed required = 214227 bytes per sec
*/