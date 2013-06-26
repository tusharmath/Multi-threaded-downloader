var mockery = require('../test/mock/mock.requires');
//mockery.enable();

var executer = require('../lib/TaskExecuter');

var options = {
	threads: 4,
	method: 'GET',
	port: 80,
	range: '0-100'
};
var url = 'http://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png';
var file = '/Users/tusharmathur/Desktop/temp/img.jpg';


var downloader = new executer(file, url, options);
downloader.start();