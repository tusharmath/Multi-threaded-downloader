var mtd = require('../lib/TaskExecuter');

var options = {
	count: 2,
	method: 'GET',
	port: 80,
	range: '0-100',
	onStart: function(meta) {
	headers: {
		cookie: 'aa=bb'
	},
		console.log('Download Started', meta);
	},
	onEnd: function(err, result) {
		if (err) console.error(err);
		console.log('Download Complete');
	}
};

var url = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Gadget_the_pug_expressive_eyes.jpg';
var file = '/Users/tusharmathur/Desktop/temp/Gadget_the_pug_expressive_eyes.jpg';

var downloader = new mtd(file, url, options);
downloader.start();