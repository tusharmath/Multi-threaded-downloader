var mtd = require('../lib/TaskExecuter');

var options = {
	count: 32,
	method: 'GET',
	port: 80,
	range: '0-100',
	timeout: 5000,
	onStart: function(meta) {
		console.log('Download Started');
	},
	onThreadChanged: function(threads) {
		console.log('Data was written to the file');
	},
	//TODO : Implement
	retry: true
};
var url = 'http://download-ln.jetbrains.com/teamcity/TeamCity-8.0.tar.gz';
var file = '/Users/tusharmathur/Desktop/temp/TeamCity-8.0.tar.gz';
var downloader = new mtd(file, url, options);
downloader.start();