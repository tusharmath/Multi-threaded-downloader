var nd = require('./ndRequest');
var options = {
	path: './Temp/',
	url: 'http://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png'
};
var req = new nd(options);
req.start();