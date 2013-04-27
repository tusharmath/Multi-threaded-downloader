var core = require('../lib/core');


var options = {
	fileName: 'Wikipedia-logo.png',
	url: 'http://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
	checksum: {
		sha1: 'ff5612ff9c3d7f9d4e88822f5e5620a59364527a'
	}
};
var downloader = new core(options);
downloader.download();

/*
440 seconds video HD = 94260006
Speed required = 214227 bytes per sec
*/