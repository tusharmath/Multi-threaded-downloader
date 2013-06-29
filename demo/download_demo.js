var mockery = require('../test/mock/mock.requires');
//mockery.enable();

var executer = require('../lib/TaskExecuter');

var options = {
	count: 4,
	method: 'GET',
	port: 80,
	range: '0-100',
	timeout: 5000,
	//TODO : Implement
	retry: true


};
var url = 'http://joaomoreno.github.io/thyme/dist/Thyme-0.4.2.dmg';
var file = '/Users/tusharmathur/Desktop/temp/Thyme.dmg';


var downloader = new executer(file, url, options);
downloader.start();