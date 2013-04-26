var core = require('../lib/core');


var options = {
	path: './test/node-v0.10.4.pkg',
	url: 'http://nodejs.org/dist/v0.10.4/node-v0.10.4.pkg'
};
var downloader = new core(options);
downloader.download();

/*
440 seconds video HD = 94260006
Speed required = 214227 bytes per sec
*/