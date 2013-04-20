var nd = require('./ndRequest');
var options = {
	path: './Temp/Download.png',
	url: 'http://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png',
	thread: 4

};
var req = new nd(options);
req.start();