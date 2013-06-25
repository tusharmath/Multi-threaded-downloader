var executer = require('../lib/TaskExecuter');

var options = {
	threads: 32,
	method: 'GET',
	port: 80,
	range: '0-100'
};
var url = 'http://nodejs.org/dist/v0.10.12/node-v0.10.12.pkg';
var file = '/Users/tusharmathur/Downloads';


var downloader = new executer(file, url, options);
downloader.start();
downloader.defaultCallback = function(a, b) {
	console.log('Result:', b);
};