var mockery = require('../test/mock/mock.requires');
//mockery.enable();

var executer = require('../lib/TaskExecuter');

var options = {
	threads: 4,
	method: 'GET',
	port: 80,
	range: '0-100'
};
var url = 'http://download-ln.jetbrains.com/teamcity/TeamCity-8.0.tar.gz';
var file = '/Users/tusharmathur/Desktop/temp/TeamCity-8.0.tar.gz';


var downloader = new executer(file, url, options);
downloader.start();